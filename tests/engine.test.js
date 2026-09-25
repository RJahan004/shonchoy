// Run: npm test   (Node 20+, no dependencies)
import { test } from 'node:test'
import assert from 'node:assert/strict'
globalThis.localStorage = { getItem: () => null, setItem() {} }
const { computePlan, debtPayoff, monthlyIncome, investmentGuidance } = await import('../public/js/engine.js')
const { SCHEMA_EXAMPLE } = await import('../public/js/store.js')

test('sample schema → expected plan', () => {
  const p = computePlan(SCHEMA_EXAMPLE)
  assert.equal(p.income, 20000)
  assert.equal(p.totalExpenses, 9000)
  assert.equal(p.disposable, 11000)
  assert.equal(p.debtCarveOut, 500)
  assert.equal(p.leftover, 10500)
  assert.equal(p.emergency.target, 27000) // 3 × 9000 essentials
  assert.equal(p.split.emergency + p.split.goals + p.split.flexible, 10500)
  assert.ok(p.split.emergency > p.split.goals) // weighted to emergency fund
  assert.ok(p.healthScore >= 0 && p.healthScore <= 100)
  assert.ok(p.insights.length >= 2 && p.insights.length <= 3)
})
test('irregular income → 6-month emergency target', () => {
  const p = computePlan({ ...SCHEMA_EXAMPLE, income: { type: 'irregular', sources: [{ name: 'business', amount: 20000 }] } })
  assert.equal(p.emergency.months, 6); assert.equal(p.emergency.target, 54000)
})
test('yearly income is divided by 12', () => assert.equal(monthlyIncome({ type: 'yearly', sources: [{ amount: 120000 }] }), 10000))
test('debt payoff', () => {
  assert.equal(debtPayoff(5000, 20, 500).months, 12)
  assert.equal(debtPayoff(1200, 0, 100).months, 12)
  assert.equal(debtPayoff(10000, 60, 400).neverEnds, true)
})
test('DTI + high-interest flags', () => {
  const p = computePlan({ ...SCHEMA_EXAMPLE, debts: [{ type: 'informal', amount: 50000, interestRate: 60, minMonthlyPayment: 9000 }] })
  assert.equal(p.dtiLevel, 'danger'); assert.equal(p.hasHighInterest, true); assert.ok(p.extraDebt > 0)
})
test('full emergency fund → nothing more goes to it', () => {
  const p = computePlan({ ...SCHEMA_EXAMPLE, logs: [{ date: '2026-01-01', amount: 30000, note: '' }] })
  assert.equal(p.split.emergency, 0); assert.equal(p.split.stage, 'efFull')
})
test('overspending → shortfall, zero leftover', () => {
  const p = computePlan({ ...SCHEMA_EXAMPLE, expenses: [{ category: 'rent', name: 'x', amount: 21000, type: 'fixed' }] })
  assert.equal(p.leftover, 0); assert.ok(p.shortfall > 0); assert.equal(p.insights[0].key, 'ins.shortfall')
})
test('investment guidance caps risk on short horizons and never names products', () => {
  const g = investmentGuidance({ years: 2, risk: 'high' })
  assert.equal(g.profile, 'low'); assert.ok(g.tips.includes('inv.tip.capped'))
})
