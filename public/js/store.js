/**
 * $honchoy — shared data store
 * ---------------------------------------------------------------
 * ONE source of truth for every screen. The state object keeps the
 * team's agreed schema EXACTLY (see SCHEMA_EXAMPLE below). Screens never
 * change `state` directly: they call `update(fn)`, which saves to
 * localStorage and tells every subscriber to re-render.
 *
 *   import { getState, update, subscribe } from './store.js'
 *   update(s => { s.expenses.push({...}) })
 *
 * Privacy: everything stays in the user's browser (localStorage).
 * The age gate stores only a boolean (`user.ageConfirmed`), never an age.
 */

const STORAGE_KEY = 'shonchoy:v1'

/** The agreed team schema, with sample values. Also used as "demo data". */
export const SCHEMA_EXAMPLE = {
  app: '$honchoy',
  user: { ageConfirmed: true, language: 'en' },
  income: { type: 'monthly', sources: [{ name: 'salary', amount: 20000 }] },
  expenses: [
    { category: 'rent', name: 'House rent', amount: 6000, type: 'fixed' },
    { category: 'food', name: 'Groceries', amount: 3000, type: 'variable' }
  ],
  debts: [{ type: 'microloan', amount: 5000, interestRate: 20, minMonthlyPayment: 500 }],
  goals: [{ id: 'g1', name: 'Sewing machine', cost: 15000, saved: 3000, type: 'custom' }],
  logs: [{ date: '2026-09-25', amount: 1000, note: '' }]
}

/** Allowed enum values. Import these instead of hard-coding strings. */
export const ENUMS = {
  language: ['en', 'bn'],
  incomeType: ['monthly', 'yearly', 'irregular'],
  incomeSourceKinds: ['salary', 'freelancing', 'business', 'scholarship', 'other'],
  expenseType: ['fixed', 'variable'],
  expenseCategory: ['rent', 'food', 'utilities', 'transport', 'health', 'education', 'family', 'personal', 'other'],
  debtType: ['bank', 'microloan', 'informal', 'credit'],
  goalType: ['education', 'business', 'purchase', 'travel', 'custom']
}

/** A brand-new user starts with this: same shape, no data yet. */
export function emptyState(language = 'en') {
  return {
    app: '$honchoy',
    user: { ageConfirmed: false, language },
    income: { type: 'monthly', sources: [] },
    expenses: [],
    debts: [],
    goals: [],
    logs: [] // savings deposits: they count toward the emergency fund
  }
}

/** Make any loaded object match the schema (bad or missing fields get fixed). */
function normalise(raw) {
  const base = emptyState()
  if (!raw || typeof raw !== 'object') return base
  const num = (v) => (Number.isFinite(+v) && +v >= 0 ? +v : 0)
  const pick = (v, list, dflt) => (list.includes(v) ? v : dflt)
  return {
    app: '$honchoy',
    user: {
      ageConfirmed: raw.user?.ageConfirmed === true,
      language: pick(raw.user?.language, ENUMS.language, 'en')
    },
    income: {
      type: pick(raw.income?.type, ENUMS.incomeType, 'monthly'),
      sources: (raw.income?.sources || []).map((s) => ({ name: String(s.name ?? ''), amount: num(s.amount) }))
    },
    expenses: (raw.expenses || []).map((e) => ({
      category: pick(e.category, ENUMS.expenseCategory, 'other'),
      name: String(e.name ?? ''),
      amount: num(e.amount),
      type: pick(e.type, ENUMS.expenseType, 'variable')
    })),
    debts: (raw.debts || []).map((d) => ({
      type: pick(d.type, ENUMS.debtType, 'informal'),
      amount: num(d.amount),
      interestRate: num(d.interestRate),
      minMonthlyPayment: num(d.minMonthlyPayment)
    })),
    goals: (raw.goals || []).map((g, i) => ({
      id: String(g.id ?? `g${i + 1}`),
      name: String(g.name ?? ''),
      cost: num(g.cost),
      saved: num(g.saved),
      type: pick(g.type, ENUMS.goalType, 'custom')
    })),
    logs: (raw.logs || []).map((l) => ({
      date: String(l.date ?? todayISO()),
      amount: num(l.amount),
      note: String(l.note ?? '')
    }))
  }
}

export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function newId(prefix = 'g') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// ---- internal state + pub/sub ------------------------------------------
let state = load()
const listeners = new Set()

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved) return normalise(saved)
  } catch (_) { /* corrupted storage → start fresh */ }
  const browserBn = (navigator.language || '').toLowerCase().startsWith('bn')
  return emptyState(browserBn ? 'bn' : 'en')
}

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch (_) { /* private mode */ }
}

/** Read-only view of the current state. Do not change it directly. Use update(). */
export function getState() { return state }

/** Change state safely: update(s => { s.goals.push(goal) }) */
export function update(mutator) {
  const draft = structuredClone(state)
  mutator(draft)
  state = normalise(draft)
  persist()
  listeners.forEach((fn) => fn(state))
}

/** Swap in a whole state object (import, demo data, reset). */
export function replaceState(next) {
  state = normalise(next)
  persist()
  listeners.forEach((fn) => fn(state))
}

/** Subscribe to changes. Returns an unsubscribe function. */
export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Export JSON in the exact team schema. */
export function exportJSON() { return JSON.stringify(state, null, 2) }
