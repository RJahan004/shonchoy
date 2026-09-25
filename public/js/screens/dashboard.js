/**
 * HOME: financial overview dashboard (read-only)
 * Income vs expenses · emergency fund · goal progress · health score 0–100 · 2–3 insights
 */
import { t, money, num } from '../i18n.js'
import { esc, progressBar } from '../ui.js'

const INSIGHT_ICONS = { 'ins.shortfall': 'fa-triangle-exclamation', 'ins.dti.warn': 'fa-scale-unbalanced', 'ins.dti.danger': 'fa-scale-unbalanced',
  'ins.highInterest': 'fa-percent', 'ins.ef': 'fa-shield-heart', 'ins.efDone': 'fa-shield-heart', 'ins.savingGreat': 'fa-star',
  'ins.savingSome': 'fa-piggy-bank', 'ins.goal': 'fa-bullseye', 'ins.bigCategory': 'fa-magnifying-glass-chart', 'ins.noIncome': 'fa-wallet' }
const PART_MAX = { cashflow: 20, savingsRate: 25, debt: 25, emergency: 20, goals: 10 }

export default {
  render(el, state, plan) {
    const max = Math.max(plan.income, plan.totalExpenses + plan.minDebtPayments, 1)
    const insightText = (i) => {
      const p = { ...i.p }
      if (p.name) p.name = esc(p.name)
      if (p.cat) p.cat = t('exp.cat.' + p.cat)
      return t(i.key, p)
    }
    const bar = (label, value, color) => `<div><div class="bar-row__label"><span>${label}</span><strong class="num">${money(value)}</strong></div>
      <div class="bar"><span style="width:${(Math.max(0, value) / max) * 100}%;background:${color}"></span></div></div>`

    el.innerHTML = `
    <div class="container">
      <header class="screen-head"><h1>${t('dash.hello')}</h1><p>${t('dash.subtitle')}</p></header>
      <div class="grid-2" style="align-items:start">
        <section class="card card--brand score-card" aria-labelledby="score-h">
          <div class="score-ring" style="--p:${plan.healthScore}" role="img" aria-label="${plan.healthScore} / 100">
            <div class="score-ring__inner"><div><div class="score-ring__num">${num(plan.healthScore)}</div><div class="score-ring__of">/ ${num(100)}</div></div></div>
          </div>
          <div class="stack-sm">
            <p style="opacity:.9">${t('dash.health')}</p>
            <h2 id="score-h" style="font-size:var(--text-2xl)">${t('dash.health.' + plan.healthLevel)}</h2>
            <p class="text-sm" style="opacity:.9">${t('dash.savedMonth')}: <strong>${money(plan.leftover)}</strong></p>
          </div>
        </section>

        <section class="card" aria-labelledby="ins-h">
          <h2 id="ins-h" style="margin-bottom:var(--space-2)">${t('dash.insights')}</h2>
          ${plan.insights.map((i) => `<div class="insight"><span class="insight__dot"><i class="fa-solid ${INSIGHT_ICONS[i.key] || 'fa-lightbulb'}"></i></span><p class="text-sm">${insightText(i)}</p></div>`).join('')}
        </section>

        <section class="card stack" aria-labelledby="ie-h">
          <h2 id="ie-h">${t('dash.incVsExp')}</h2>
          <div class="bars">
            ${bar(t('plan.income'), plan.income, 'var(--gradient-brand)')}
            ${bar(t('plan.expenses'), plan.totalExpenses, 'var(--color-flexible)')}
            ${plan.minDebtPayments ? bar(t('plan.debt'), plan.minDebtPayments, 'var(--color-goals)') : ''}
          </div>
        </section>

        <section class="card stack" aria-labelledby="prog-h">
          <h2 id="prog-h" class="sr-only">${t('dash.savings')}</h2>
          <div>
            <div class="row row--between"><h3>${t('dash.savings')}</h3><span class="pill">${Math.round(plan.emergency.progress * 100)}%</span></div>
            <div style="margin-top:var(--space-2)">${progressBar(plan.emergency.progress, { variant: plan.emergency.progress >= 1 ? 'success' : '', label: t('dash.savings') })}</div>
            <div class="progress-meta num"><span>${money(plan.emergency.saved)}</span><span>${money(plan.emergency.target)}</span></div>
          </div>
          <div>
            <h3>${t('dash.goalProgress')}</h3>
            ${plan.goals.length ? plan.goals.slice(0, 4).map((g) => `<div style="margin-top:var(--space-3)">
                <div class="progress-meta" style="margin:0 0 4px"><span>${esc(g.name)}</span><span class="num">${Math.round(g.progress * 100)}%</span></div>
                ${progressBar(g.progress, { variant: g.progress >= 1 ? 'success' : 'goals', size: 'sm', label: g.name })}</div>`).join('')
              : `<p class="text-sm muted" style="margin-top:var(--space-2)">${t('dash.noGoals')}</p>`}
          </div>
        </section>

        <section class="card" aria-labelledby="parts-h" style="grid-column:1/-1">
          <h2 id="parts-h" style="margin-bottom:var(--space-3)">${t('dash.scoreParts')}</h2>
          <div class="parts">
            ${Object.entries(plan.healthParts).map(([k, v]) => `<div class="part"><span>${t('dash.part.' + k)}</span>
              ${progressBar(v / PART_MAX[k], { size: 'sm' })}<span class="num text-strong" style="text-align:right">${num(v)}/${num(PART_MAX[k])}</span></div>`).join('')}
          </div>
        </section>
      </div>
    </div>`
  }
}
