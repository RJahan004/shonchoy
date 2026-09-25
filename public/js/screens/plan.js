/**
 * PLAN: automatic budget planner (reads computePlan() output) + savings log
 * Writes: state.logs[] = { date: 'YYYY-MM-DD', amount, note }  (counts toward emergency fund)
 */
import { update, todayISO } from '../store.js'
import { t, money, lang } from '../i18n.js'
import { esc, formData, toast } from '../ui.js'

export default {
  render(el, state, plan, ctx) {
    const s = plan.split
    const parts = [
      { k: 'emergency', v: s.emergency, c: 'var(--color-emergency)', i: 'fa-shield-heart' },
      { k: 'goals', v: s.goals, c: 'var(--color-goals)', i: 'fa-bullseye' },
      { k: 'flexible', v: s.flexible, c: 'var(--color-flexible)', i: 'fa-mug-hot' }
    ]
    const pct = (v) => (plan.leftover > 0 ? Math.round((v / plan.leftover) * 100) : 0)
    const fmtDate = (iso) => new Date(iso + 'T00:00').toLocaleDateString(lang() === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'short' })

    el.innerHTML = `
    <div class="container">
      <header class="screen-head row row--between">
        <div><h1>${t('plan.title')}</h1><p>${t('plan.subtitle')}</p></div>
        <a href="#/settings" class="btn btn--ghost btn--sm" id="edit-inc"><i class="fa-solid fa-pen"></i> ${t('set.editIncome')}</a>
      </header>
      ${plan.income <= 0 ? `<div class="alert alert--warn">${t('plan.noIncome')}</div>` : ''}
      <div class="grid-2" style="align-items:start">
        <section class="card stack" aria-labelledby="flow-h">
          <h2 id="flow-h" class="sr-only">${t('plan.title')}</h2>
          <div class="flow num">
            <div class="flow__row"><span>${t('plan.income')}</span><strong>${money(plan.income)}</strong></div>
            <div class="flow__row flow__row--minus"><span>− ${t('plan.expenses')}</span><span>${money(plan.totalExpenses)}</span></div>
            <div class="flow__row"><span>= ${t('plan.disposable')}</span><strong>${money(plan.disposable)}</strong></div>
            <div class="flow__row flow__row--minus"><span>− ${t('plan.debt')}${plan.extraDebt ? `<br><small class="muted">${t('plan.extraDebt', { amount: plan.extraDebt })}</small>` : ''}</span><span>${money(plan.debtCarveOut)}</span></div>
            <div class="flow__row flow__row--total"><span>= ${t('plan.leftover')}</span><span>${money(plan.leftover)}</span></div>
          </div>
          ${plan.shortfall > 0 ? `<div class="alert alert--danger"><i class="fa-solid fa-circle-exclamation"></i><span>${t('plan.shortfall', { amount: plan.shortfall })}</span></div>` : ''}
          <details class="text-sm"><summary class="text-strong" style="cursor:pointer">${t('plan.formula')}</summary>
            <p class="muted" style="margin-top:var(--space-2)">${t('plan.formulaText')}</p></details>
        </section>

        <section class="card stack" aria-labelledby="split-h">
          <h2 id="split-h">${t('plan.split', { amount: plan.leftover })}</h2>
          <div class="split-bar" aria-hidden="true">${parts.map((p) => `<span style="flex-grow:${p.v || 0};background:${p.c}"></span>`).join('')}</div>
          <div class="split-legend">
            ${parts.map((p) => `<div class="split-item" style="border-color:${p.c}">
              <div class="text-sm muted"><i class="fa-solid ${p.i}" style="color:${p.c}"></i> ${t('plan.' + p.k)}</div>
              <div class="stat__value">${money(p.v)}</div><div class="text-xs muted">${pct(p.v)}%</div></div>`).join('')}
          </div>
          <div class="alert"><i class="fa-solid fa-lightbulb"></i><span>${t('plan.why.' + s.stage)}</span></div>
        </section>

        <section class="card stack" aria-labelledby="log-h">
          <div><h2 id="log-h">${t('plan.logTitle')}</h2><p class="text-sm muted">${t('plan.logHint')}</p></div>
          <form id="log-form" class="form-grid" novalidate>
            <div class="field"><label class="label" for="log-amt">${t('common.amount')}</label>
              <input class="input num" id="log-amt" name="amount" type="number" inputmode="numeric" min="0" value="${s.emergency || ''}" /></div>
            <div class="field"><label class="label" for="log-note">${t('plan.logNote')}</label>
              <input class="input" id="log-note" name="note" maxlength="60" /></div>
            <button class="btn btn--primary" type="submit"><i class="fa-solid fa-piggy-bank"></i> ${t('plan.logAdd')}</button>
          </form>
          ${state.logs.length ? `<div><h3 class="text-sm muted">${t('plan.logs')}</h3><ul class="list">
            ${state.logs.map((l, i) => ({ l, i })).reverse().slice(0, 6).map(({ l, i }) => `<li class="list-item">
              <span class="pill pill--success">${fmtDate(l.date)}</span>
              <span class="list-item__main text-sm muted">${esc(l.note)}</span>
              <span class="list-item__amount">+${money(l.amount)}</span>
              <button class="icon-btn" data-del-log="${i}" aria-label="${t('common.remove')}"><i class="fa-solid fa-xmark"></i></button></li>`).join('')}
          </ul></div>` : ''}
        </section>
      </div>
    </div>`

    el.querySelector('#edit-inc').addEventListener('click', (e) => { e.preventDefault(); ctx.go('income') })
    el.querySelector('#log-form').addEventListener('submit', (e) => {
      e.preventDefault()
      const d = formData(e.target, ['amount'])
      if (d.amount <= 0) return
      update((st) => { st.logs.push({ date: todayISO(), amount: d.amount, note: d.note.trim() }) })
      toast('🎉 +' + money(d.amount))
    })
    el.querySelectorAll('[data-del-log]').forEach((b) => b.addEventListener('click', () => update((st) => { st.logs.splice(+b.dataset.delLog, 1) })))
  }
}
