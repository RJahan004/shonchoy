/**
 * ONBOARDING STEP 2: Income setup (also reused from Settings → "Edit income")
 * Writes: state.income = { type: 'monthly'|'yearly'|'irregular', sources: [{ name, amount }] }
 *
 * Schema note: a source only has { name, amount }. The "kind" dropdown
 * (salary/freelancing/...) is stored AS the name when the user leaves the
 * custom name empty, e.g. { name: 'salary', amount: 20000 }, which matches the
 * sample schema. The UI shows kind names translated.
 *
 * The form keeps a local draft (not saved until "Save & continue"), so
 * switching language mid-form doesn't lose what was typed.
 */
import { update, ENUMS } from '../store.js'
import { t, money } from '../i18n.js'
import { monthlyIncome } from '../engine.js'
import { esc, options, icon } from '../ui.js'
import { stepDots } from './onboarding-age.js'

const KINDS = ENUMS.incomeSourceKinds
let draft = null // { type, rows: [{ kind, name, amount }] }

function toDraft(income) {
  const rows = income.sources.map((s) => {
    const k = s.name.trim().toLowerCase()
    return KINDS.includes(k) ? { kind: k, name: '', amount: s.amount } : { kind: 'other', name: s.name, amount: s.amount }
  })
  return { type: income.type, rows: rows.length ? rows : [{ kind: 'salary', name: '', amount: '' }] }
}
function fromDraft(d) {
  return {
    type: d.type,
    sources: d.rows.filter((r) => +r.amount > 0).map((r) => ({ name: r.name.trim() || r.kind, amount: +r.amount }))
  }
}

export default {
  render(el, state, _plan, ctx) {
    if (!draft) draft = toDraft(state.income)
    const editing = state.income.sources.length > 0

    const amountLabel = { monthly: 'inc.amountMonthly', yearly: 'inc.amountYearly', irregular: 'inc.amountIrregular' }
    const rowHTML = (r, i) => `
      <div class="source-row" data-row="${i}">
        <div class="field"><label class="label" for="kind-${i}">${t('inc.kind')}</label>
          <select class="select" id="kind-${i}" data-f="kind">${options(KINDS, 'inc.kind.', r.kind)}</select></div>
        <div class="field field--name"><label class="label" for="name-${i}">${t('common.name')}</label>
          <input class="input" id="name-${i}" data-f="name" value="${esc(r.name)}" placeholder="${esc(t('inc.kind.' + r.kind))}" maxlength="40" autocomplete="off" /></div>
        <div class="field"><label class="label" for="amt-${i}">${t(amountLabel[draft.type])}</label>
          <input class="input num" id="amt-${i}" data-f="amount" type="number" inputmode="numeric" min="0" step="1" value="${esc(r.amount)}" placeholder="0" /></div>
        ${draft.rows.length > 1 ? `<button type="button" class="icon-btn" data-remove="${i}" aria-label="${t('common.remove')}"><i class="fa-solid fa-xmark"></i></button>` : '<span></span>'}
      </div>`

    el.innerHTML = `
    <section class="container container--narrow ob-wrap" aria-labelledby="inc-title">
      ${editing ? '' : stepDots(2, ctx.steps)}
      <form id="inc-form" class="card stack-lg" style="margin-top:var(--space-4)" novalidate>
        <div>
          <h1 id="inc-title">${t('inc.title')}</h1>
          <p class="muted" style="margin-top:var(--space-1)">${t('inc.subtitle')}</p>
        </div>

        <fieldset class="stack-sm" style="border:0;padding:0;margin:0">
          <legend class="label" style="margin-bottom:var(--space-2)">${t('inc.typeLabel')}</legend>
          <div class="choice-grid">
            ${ENUMS.incomeType.map((ty) => `
              <label class="choice"><input type="radio" name="type" value="${ty}" ${draft.type === ty ? 'checked' : ''} />
                <span class="choice__body"><span class="choice__icon">${icon(ty)}</span>
                  <span><span class="choice__title">${t('inc.type.' + ty)}</span><span class="choice__hint">${t('inc.type.' + ty + '.hint')}</span></span>
                </span></label>`).join('')}
          </div>
          ${draft.type === 'irregular' ? `<div class="alert"><i class="fa-solid fa-circle-info"></i><span>${t('inc.irregularNote')}</span></div>` : ''}
        </fieldset>

        <fieldset class="stack-sm" style="border:0;padding:0;margin:0">
          <legend class="label" style="margin-bottom:var(--space-2)">${t('inc.sourcesLabel')}</legend>
          <div class="stack-sm" id="rows">${draft.rows.map(rowHTML).join('')}</div>
          <button type="button" id="add-row" class="btn btn--secondary btn--sm"><i class="fa-solid fa-plus"></i> ${t('inc.addSource')}</button>
        </fieldset>

        <div class="total-bar"><span>${t('inc.total')}</span><strong id="inc-total" class="num">৳0</strong></div>
        <p id="inc-error" class="form-error" role="alert"></p>
        <div class="row row--between">
          ${editing ? `<a href="#/settings" class="btn btn--ghost">${t('common.cancel')}</a>` : `<button type="button" class="btn btn--ghost" id="back-btn"><i class="fa-solid fa-arrow-left"></i> ${t('common.back')}</button>`}
          <button type="submit" class="btn btn--primary">${t('inc.finish')} <i class="fa-solid fa-check"></i></button>
        </div>
      </form>
    </section>`

    const refreshTotal = () => {
      el.querySelector('#inc-total').textContent = money(monthlyIncome(fromDraft(draft)))
    }
    const rerender = () => this.render(el, state, _plan, ctx)
    refreshTotal()

    // Typing: update draft without re-rendering (keeps focus)
    el.querySelector('#rows').addEventListener('input', (e) => {
      const row = e.target.closest('[data-row]'); if (!row) return
      const r = draft.rows[+row.dataset.row]
      r[e.target.dataset.f] = e.target.value
      if (e.target.dataset.f === 'kind') el.querySelector(`#name-${row.dataset.row}`).placeholder = t('inc.kind.' + r.kind)
      refreshTotal()
    })
    el.querySelectorAll('input[name=type]').forEach((radio) => radio.addEventListener('change', () => { draft.type = radio.value; rerender() }))
    el.querySelector('#add-row').addEventListener('click', () => {
      draft.rows.push({ kind: 'freelancing', name: '', amount: '' }); rerender()
      el.querySelector(`#amt-${draft.rows.length - 1}`).focus()
    })
    el.querySelectorAll('[data-remove]').forEach((b) => b.addEventListener('click', () => { draft.rows.splice(+b.dataset.remove, 1); rerender() }))
    el.querySelector('#back-btn')?.addEventListener('click', () => { update((s) => { s.user.ageConfirmed = false }) })

    el.querySelector('#inc-form').addEventListener('submit', (e) => {
      e.preventDefault()
      const income = fromDraft(draft)
      if (!income.sources.length) { el.querySelector('#inc-error').textContent = t('inc.needOne'); return }
      draft = null
      update((s) => { s.income = income })
      ctx.go(editing ? 'plan' : 'money')
    })
  }
}
