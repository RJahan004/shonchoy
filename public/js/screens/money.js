/**
 * MONEY: expense tracking + debt overview
 * Writes: state.expenses[] = { category, name, amount, type: 'fixed'|'variable' }
 *         state.debts[]    = { type, amount, interestRate, minMonthlyPayment }
 * All maths (DTI, high-interest flags, payoff) comes from engine.js.
 */
import { update, ENUMS } from '../store.js'
import { t, money, num, duration } from '../i18n.js'
import { debtPayoff } from '../engine.js'
import { esc, options, icon, formData, paintSlider, toast } from '../ui.js'

let expType = 'fixed' // remembers the fixed/variable toggle between renders
let calcDebt = 0 // which debt the payoff calculator is looking at

export default {
  render(el, state, plan) {
    const dtiPct = Math.round(plan.dti * 100)
    el.innerHTML = `
    <div class="container">
      <header class="screen-head"><h1>${t('money.title')}</h1></header>
      <div class="grid-2" style="align-items:start">

      <!-- ============ EXPENSES ============ -->
      <section class="card" aria-labelledby="exp-h">
        <div class="card__head"><div><h2 id="exp-h">${t('exp.title')}</h2><p>${t('exp.subtitle')}</p></div></div>

        <form id="exp-form" class="stack" novalidate>
          <div class="segmented" role="group" aria-label="${t('exp.title')}">
            ${ENUMS.expenseType.map((ty) => `<button type="button" data-exptype="${ty}" class="${expType === ty ? 'is-active' : ''}" aria-pressed="${expType === ty}">${t('exp.type.' + ty)}</button>`).join('')}
          </div>
          <div class="form-grid">
            <div class="field"><label class="label" for="exp-cat">${t('exp.category')}</label>
              <select class="select" id="exp-cat" name="category">${options(ENUMS.expenseCategory, 'exp.cat.', expType === 'fixed' ? 'rent' : 'food')}</select></div>
            <div class="field"><label class="label" for="exp-name">${t('common.name')}</label>
              <input class="input" id="exp-name" name="name" maxlength="40" placeholder="${esc(t('exp.namePh'))}" autocomplete="off" /></div>
            <div class="field"><label class="label" for="exp-amt">${t('common.amount')}</label>
              <input class="input num" id="exp-amt" name="amount" type="number" inputmode="numeric" min="0" placeholder="0" /></div>
          </div>
          <p class="form-error" id="exp-err" role="alert"></p>
          <button class="btn btn--primary btn--block" type="submit"><i class="fa-solid fa-plus"></i> ${t('exp.add')}</button>
        </form>

        <ul class="list" style="margin-top:var(--space-4)">
          ${state.expenses.length ? state.expenses.map((e, i) => `
            <li class="list-item">
              <span class="choice__icon">${icon(e.category)}</span>
              <div class="list-item__main">
                <div class="list-item__title">${esc(e.name || t('exp.cat.' + e.category))}</div>
                <div class="list-item__meta"><span>${t('exp.cat.' + e.category)}</span>
                  <span class="pill ${e.type === 'fixed' ? 'pill--fixed' : ''}">${t('exp.type.' + e.type)}</span></div>
              </div>
              <span class="list-item__amount">${money(e.amount)}</span>
              <button class="icon-btn" data-del-exp="${i}" aria-label="${t('common.remove')}"><i class="fa-solid fa-trash-can"></i></button>
            </li>`).join('') : `<li class="empty">${t('common.empty')}</li>`}
        </ul>
        <div class="grid-3" style="margin-top:var(--space-4);grid-template-columns:repeat(3,1fr);gap:var(--space-2)">
          <div class="stat"><div class="stat__label">${t('exp.fixedTotal')}</div><div class="stat__value" style="font-size:var(--text-lg)">${money(plan.fixedExpenses)}</div></div>
          <div class="stat"><div class="stat__label">${t('exp.variableTotal')}</div><div class="stat__value" style="font-size:var(--text-lg)">${money(plan.variableExpenses)}</div></div>
          <div class="stat"><div class="stat__label">${t('common.total')}</div><div class="stat__value" style="font-size:var(--text-lg);color:var(--color-primary-strong)">${money(plan.totalExpenses)}</div></div>
        </div>
      </section>

      <!-- ============ DEBTS ============ -->
      <section class="card" aria-labelledby="debt-h">
        <div class="card__head"><div><h2 id="debt-h">${t('debt.title')}</h2><p>${t('debt.subtitle')}</p></div></div>

        <form id="debt-form" class="stack" novalidate>
          <div class="form-grid" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
            <div class="field"><label class="label" for="debt-type">${t('debt.type')}</label>
              <select class="select" id="debt-type" name="type">${options(ENUMS.debtType, 'debt.type.', 'microloan')}</select></div>
            <div class="field"><label class="label" for="debt-amt">${t('debt.amount')}</label>
              <input class="input num" id="debt-amt" name="amount" type="number" inputmode="numeric" min="0" placeholder="0" /></div>
            <div class="field"><label class="label" for="debt-rate">${t('debt.rate')}</label>
              <input class="input num" id="debt-rate" name="interestRate" type="number" inputmode="decimal" min="0" step="0.1" placeholder="${esc(t('debt.ratePh'))}" /></div>
            <div class="field"><label class="label" for="debt-min">${t('debt.min')}</label>
              <input class="input num" id="debt-min" name="minMonthlyPayment" type="number" inputmode="numeric" min="0" placeholder="0" /></div>
          </div>
          <p class="form-error" id="debt-err" role="alert"></p>
          <button class="btn btn--primary btn--block" type="submit"><i class="fa-solid fa-plus"></i> ${t('debt.add')}</button>
        </form>

        ${plan.debts.length ? `
          <div class="grid-3" style="margin-top:var(--space-5);grid-template-columns:repeat(3,1fr);gap:var(--space-2)">
            <div class="stat"><div class="stat__label">${t('debt.totalOwed')}</div><div class="stat__value" style="font-size:var(--text-lg)">${money(plan.totalDebt)}</div></div>
            <div class="stat"><div class="stat__label">${t('debt.monthly')}</div><div class="stat__value" style="font-size:var(--text-lg)">${money(plan.minDebtPayments)}</div></div>
            <div class="stat"><div class="stat__label">${t('debt.dti')}</div><div class="stat__value" style="font-size:var(--text-lg);color:var(--color-${plan.dtiLevel === 'ok' ? 'success' : plan.dtiLevel === 'warn' ? 'warning' : 'danger'})">${num(dtiPct)}%</div></div>
          </div>
          <div class="alert alert--${plan.dtiLevel === 'ok' ? 'success' : plan.dtiLevel}" style="margin-top:var(--space-3)">
            <i class="fa-solid ${plan.dtiLevel === 'ok' ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i>
            <span>${t('debt.dti.' + plan.dtiLevel, { pct: dtiPct })}</span></div>

          <ul class="list" style="margin-top:var(--space-3)">
            ${plan.debts.map((d) => `
              <li class="list-item" style="flex-wrap:wrap">
                <span class="choice__icon">${icon(d.type)}</span>
                <div class="list-item__main">
                  <div class="list-item__title">${t('debt.type.' + d.type)}</div>
                  <div class="list-item__meta">
                    <span class="pill ${d.highInterest ? 'pill--danger' : ''}">${num(d.interestRate)}%</span>
                    <span>${money(d.minMonthlyPayment)}${t('common.perMonth')}</span>
                  </div>
                </div>
                <span class="list-item__amount">${money(d.amount)}</span>
                <button class="icon-btn" data-del-debt="${d.index}" aria-label="${t('common.remove')}"><i class="fa-solid fa-trash-can"></i></button>
                <div style="flex-basis:100%" class="stack-sm">
                  ${d.payoff.neverEnds
                    ? `<div class="alert alert--danger"><i class="fa-solid fa-circle-exclamation"></i><span>${t('debt.neverEnds')}</span></div>`
                    : `<p class="text-sm muted"><i class="fa-regular fa-calendar"></i> ${t('debt.payoff', { time: duration(d.payoff.months), interest: d.payoff.totalInterest })}</p>`}
                  ${d.highInterest ? `<div class="alert alert--warn"><i class="fa-solid fa-triangle-exclamation"></i><span>${t('debt.highRate')}</span></div>` : ''}
                </div>
              </li>`).join('')}
          </ul>

          <!-- Payoff calculator -->
          <div class="card card--soft stack" style="margin-top:var(--space-4);box-shadow:none" id="calc">
            <div><h3>${t('debt.calcTitle')}</h3><p class="text-sm muted">${t('debt.calcHint')}</p></div>
            ${plan.debts.length > 1 ? `<select class="select" id="calc-debt">${plan.debts.map((d) => `<option value="${d.index}" ${d.index === calcDebt ? 'selected' : ''}>${t('debt.type.' + d.type)} · ${money(d.amount)}</option>`).join('')}</select>` : ''}
            <div class="field">
              <div class="row row--between"><label class="label" for="calc-pay">${t('debt.calcPay')}</label><strong class="num" id="calc-val"></strong></div>
              <input type="range" class="slider" id="calc-pay" />
            </div>
            <p id="calc-out" class="text-strong" aria-live="polite"></p>
            <p id="calc-saved" class="text-sm" style="color:var(--color-success)"></p>
          </div>`
        : `<p class="empty"><i class="fa-regular fa-face-smile"></i> ${t('debt.none')}</p>`}
      </section>
      </div>
    </div>`

    // ---- Expense events ----
    el.querySelectorAll('[data-exptype]').forEach((b) => b.addEventListener('click', () => {
      expType = b.dataset.exptype
      el.querySelectorAll('[data-exptype]').forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-pressed', x === b) })
    }))
    el.querySelector('#exp-form').addEventListener('submit', (e) => {
      e.preventDefault()
      const d = formData(e.target, ['amount'])
      if (d.amount <= 0) { el.querySelector('#exp-err').textContent = t('common.required'); return }
      update((s) => { s.expenses.push({ category: d.category, name: d.name.trim() || t('exp.cat.' + d.category), amount: d.amount, type: expType }) })
      toast('✓ ' + t('exp.add'))
    })
    el.querySelectorAll('[data-del-exp]').forEach((b) => b.addEventListener('click', () => update((s) => { s.expenses.splice(+b.dataset.delExp, 1) })))

    // ---- Debt events ----
    el.querySelector('#debt-form').addEventListener('submit', (e) => {
      e.preventDefault()
      const d = formData(e.target, ['amount', 'interestRate', 'minMonthlyPayment'])
      if (d.amount <= 0) { el.querySelector('#debt-err').textContent = t('common.required'); return }
      update((s) => { s.debts.push(d) })
      toast('✓ ' + t('debt.add'))
    })
    el.querySelectorAll('[data-del-debt]').forEach((b) => b.addEventListener('click', () => { calcDebt = 0; update((s) => { s.debts.splice(+b.dataset.delDebt, 1) }) }))

    // ---- Payoff calculator (live, no state writes) ----
    const slider = el.querySelector('#calc-pay')
    if (slider) {
      if (!plan.debts[calcDebt]) calcDebt = 0
      const setup = () => {
        const d = plan.debts[calcDebt]
        const interestFloor = Math.ceil((d.amount * d.interestRate) / 1200) + 1 // must beat monthly interest
        // Range: from the smaller of (minimum payment, interest-only) up to paying it all at once
        const lo = Math.max(50, Math.min(d.minMonthlyPayment || interestFloor, interestFloor, d.amount))
        slider.step = d.amount > 20000 ? 100 : 50
        slider.min = lo
        slider.max = Math.max(d.amount, lo + 100)
        slider.value = Math.max(d.minMonthlyPayment, lo)
        calc()
      }
      const calc = () => {
        const d = plan.debts[calcDebt]
        const pay = +slider.value
        paintSlider(slider)
        el.querySelector('#calc-val').textContent = money(pay) + t('common.perMonth')
        const r = debtPayoff(d.amount, d.interestRate, pay)
        el.querySelector('#calc-out').textContent = r.neverEnds ? t('debt.neverEnds') : t('debt.calcResult', { time: duration(r.months), interest: r.totalInterest })
        const base = d.payoff
        const savedEl = el.querySelector('#calc-saved')
        if (!r.neverEnds && (base.neverEnds || r.months < base.months)) {
          savedEl.textContent = base.neverEnds ? '' : t('debt.calcSaved', { months: base.months - r.months, saved: Math.max(0, base.totalInterest - r.totalInterest) })
        } else savedEl.textContent = ''
      }
      slider.addEventListener('input', calc)
      el.querySelector('#calc-debt')?.addEventListener('change', (e) => { calcDebt = +e.target.value; setup() })
      setup()
    }
  }
}
