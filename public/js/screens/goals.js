/**
 * GOALS: emergency fund tracker · custom goals with live timeline slider · investment education
 * Writes: state.goals[] = { id, name, cost, saved, type }
 * Investment answers are NOT stored (not part of the schema); they live in memory only.
 */
import { update, ENUMS, newId } from '../store.js'
import { t, money, duration, futureMonth } from '../i18n.js'
import { investmentGuidance, monthsToGoal } from '../engine.js'
import { esc, options, icon, progressBar, formData, paintSlider, toast } from '../ui.js'

const sliderValues = {} // goalId → chosen monthly contribution (kept across re-renders)
let inv = { goal: 'education', years: 5, risk: 'medium', shown: false }

export default {
  render(el, state, plan) {
    const ef = plan.emergency
    el.innerHTML = `
    <div class="container">
      <header class="screen-head"><h1>${t('goals.title')}</h1></header>
      <div class="stack-lg">

      <!-- ============ EMERGENCY FUND ============ -->
      <section class="card card--soft stack" aria-labelledby="ef-h">
        <div class="row row--between" style="align-items:flex-start">
          <div class="row"><span class="lesson__icon"><i class="fa-solid fa-shield-heart"></i></span>
            <div><h2 id="ef-h">${t('ef.title')}</h2><p class="text-sm muted">${t('ef.explain', { months: ef.months })}</p></div></div>
          ${ef.progress >= 1 && ef.target > 0 ? `<span class="pill pill--success">100%</span>` : `<span class="pill">${Math.round(ef.progress * 100)}%</span>`}
        </div>
        ${plan.irregular ? `<div class="alert"><i class="fa-solid fa-wave-square"></i><span>${t('ef.irregular')}</span></div>` : ''}
        ${ef.target > 0 ? `
          ${progressBar(ef.progress, { variant: ef.progress >= 1 ? 'success' : '', label: t('ef.title') })}
          <div class="progress-meta"><span class="num">${t('ef.saved', { saved: ef.saved, target: ef.target })}</span></div>
          <p class="text-sm">${ef.progress >= 1 ? t('ef.done') : plan.split.emergency > 0 ? t('ef.eta', { monthly: plan.split.emergency, time: duration(ef.monthsToFull) }) : ''}</p>
          <a href="#/plan" class="btn btn--secondary btn--sm" style="align-self:flex-start"><i class="fa-solid fa-piggy-bank"></i> ${t('plan.logAdd')}</a>`
        : `<p class="text-sm muted">${t('ef.noExpenses')} <a href="#/money">→ ${t('nav.money')}</a></p>`}
      </section>

      <!-- ============ CUSTOM GOALS ============ -->
      <section class="stack" aria-labelledby="g-h">
        <h2 id="g-h">${t('goal.customTitle')}</h2>
        <div class="grid-2" style="align-items:start">
          ${plan.goals.map((g) => goalCard(g)).join('')}
          <form id="goal-form" class="card stack" novalidate style="border-style:dashed">
            <h3><i class="fa-solid fa-circle-plus" style="color:var(--color-primary)"></i> ${t('goal.add')}</h3>
            <div class="field"><label class="label" for="g-type">${t('goal.type')}</label>
              <select class="select" id="g-type" name="type">${options(ENUMS.goalType, 'goal.type.', 'education')}</select></div>
            <div class="field"><label class="label" for="g-name">${t('common.name')}</label>
              <input class="input" id="g-name" name="name" maxlength="40" placeholder="${esc(t('goal.namePh'))}" autocomplete="off" /></div>
            <div class="form-grid" style="grid-template-columns:1fr 1fr">
              <div class="field"><label class="label" for="g-cost">${t('goal.cost')}</label>
                <input class="input num" id="g-cost" name="cost" type="number" inputmode="numeric" min="0" placeholder="0" /></div>
              <div class="field"><label class="label" for="g-saved">${t('goal.saved')}</label>
                <input class="input num" id="g-saved" name="saved" type="number" inputmode="numeric" min="0" placeholder="0" /></div>
            </div>
            <p class="form-error" id="g-err" role="alert"></p>
            <button class="btn btn--primary" type="submit"><i class="fa-solid fa-plus"></i> ${t('goal.add')}</button>
          </form>
        </div>
      </section>

      <!-- ============ INVESTMENT EDUCATION ============ -->
      <section class="card stack" aria-labelledby="inv-h">
        <div class="row"><span class="lesson__icon" style="background:linear-gradient(135deg,#c49bf0,#9b5de5)"><i class="fa-solid fa-seedling"></i></span>
          <div><h2 id="inv-h">${t('inv.title')}</h2><p class="text-sm muted">${t('inv.subtitle')}</p></div></div>
        <div class="alert alert--warn"><i class="fa-solid fa-scale-balanced"></i><span>${t('inv.disclaimer')}</span></div>
        <form id="inv-form" class="stack" novalidate>
          <div class="field"><label class="label" for="inv-goal">1. ${t('inv.goal')}</label>
            <select class="select" id="inv-goal" name="goal">${options(['education', 'business', 'home', 'retirement', 'other'], 'inv.goal.', inv.goal)}</select></div>
          <div class="field">
            <div class="row row--between"><label class="label" for="inv-years">2. ${t('inv.years')}</label><strong id="inv-years-val" class="num"></strong></div>
            <input type="range" class="slider" id="inv-years" name="years" min="1" max="20" value="${inv.years}" />
          </div>
          <fieldset class="stack-sm" style="border:0;padding:0;margin:0">
            <legend class="label" style="margin-bottom:var(--space-2)">3. ${t('inv.risk')}</legend>
            ${['low', 'medium', 'high'].map((r) => `<label class="check"><input type="radio" name="risk" value="${r}" ${inv.risk === r ? 'checked' : ''} style="border-radius:50%" /><span>${t('inv.risk.' + r)}</span></label>`).join('')}
          </fieldset>
          <button class="btn btn--primary" type="submit"><i class="fa-solid fa-lightbulb"></i> ${t('inv.show')}</button>
        </form>
        <div id="inv-out" aria-live="polite"></div>
      </section>
      </div>
    </div>`

    // ---- goals ----
    el.querySelector('#goal-form').addEventListener('submit', (e) => {
      e.preventDefault()
      const d = formData(e.target, ['cost', 'saved'])
      if (!d.name.trim() || d.cost <= 0) { el.querySelector('#g-err').textContent = t('common.required'); return }
      update((s) => { s.goals.push({ id: newId(), name: d.name.trim(), cost: d.cost, saved: Math.min(d.saved, d.cost), type: d.type }) })
      toast('✓ ' + t('goal.add'))
    })
    el.querySelectorAll('[data-goal]').forEach((card) => wireGoal(card, plan.goals.find((g) => g.id === card.dataset.goal)))

    // ---- investment ----
    const years = el.querySelector('#inv-years')
    const showYears = () => { paintSlider(years); el.querySelector('#inv-years-val').textContent = t('inv.yearsVal', { n: +years.value }) }
    years.addEventListener('input', () => { inv.years = +years.value; showYears(); if (inv.shown) showGuidance() })
    showYears()
    const showGuidance = () => {
      const f = formData(el.querySelector('#inv-form'), ['years'])
      inv = { ...inv, goal: f.goal, years: f.years, risk: f.risk || 'medium', shown: true }
      const g = investmentGuidance(inv, plan)
      el.querySelector('#inv-out').innerHTML = `<div class="card card--soft stack-sm" style="box-shadow:none">
        <p class="text-strong">${t('inv.profile', { p: t('inv.profile.' + g.profile) })}</p>
        <ul class="stack-sm" style="padding-left:1.1em;margin:0">${g.tips.map((k) => `<li class="text-sm">${t(k)}</li>`).join('')}</ul></div>`
    }
    el.querySelector('#inv-form').addEventListener('submit', (e) => { e.preventDefault(); showGuidance() })
    el.querySelector('#inv-form').addEventListener('change', () => { if (inv.shown) showGuidance() })
    if (inv.shown) showGuidance()
  }
}

function goalCard(g) {
  const done = g.remaining <= 0
  return `<article class="card stack" data-goal="${esc(g.id)}">
    <div class="row row--between" style="align-items:flex-start;flex-wrap:nowrap">
      <div class="row" style="flex-wrap:nowrap;min-width:0"><span class="choice__icon">${icon(g.type)}</span>
        <div style="min-width:0"><h3 style="overflow-wrap:anywhere">${esc(g.name)}</h3><span class="text-xs muted">${t('goal.type.' + g.type)}</span></div></div>
      <button class="icon-btn" data-del aria-label="${t('common.remove')}"><i class="fa-solid fa-trash-can"></i></button>
    </div>
    ${progressBar(g.progress, { variant: done ? 'success' : 'goals', label: g.name })}
    <div class="progress-meta num"><span>${money(g.saved)} / ${money(g.cost)}</span><span>${Math.round(g.progress * 100)}%</span></div>
    ${done ? `<p class="alert alert--success">${t('goal.reached')}</p>` : `
      <div class="field">
        <div class="row row--between"><label class="label" for="sl-${esc(g.id)}">${t('goal.slider')}</label><strong class="num" data-val></strong></div>
        <input type="range" class="slider" id="sl-${esc(g.id)}" data-slider />
      </div>
      <p class="text-strong" data-eta aria-live="polite"></p>
      <div class="row row--between text-sm">
        <span class="muted">${t('goal.suggested', { amount: g.suggestedMonthly })}</span>
        ${g.suggestedMonthly > 0 ? `<button type="button" class="btn btn--ghost btn--sm" data-suggest>${t('goal.useSuggested')}</button>` : ''}
      </div>
      <form class="row" data-addsaved novalidate style="flex-wrap:nowrap">
        <input class="input num" name="amount" type="number" inputmode="numeric" min="0" placeholder="${esc(t('goal.addSavedPh'))}" aria-label="${esc(t('goal.addSaved'))}" />
        <button class="btn btn--secondary" type="submit">${t('goal.addSaved')}</button>
      </form>`}
  </article>`
}

function wireGoal(card, g) {
  card.querySelector('[data-del]').addEventListener('click', () => update((s) => { s.goals = s.goals.filter((x) => x.id !== g.id) }))
  const slider = card.querySelector('[data-slider]')
  if (!slider) return
  // Slider range: small step up to the full remaining amount (= buy it next month)
  const step = g.remaining > 50000 ? 500 : g.remaining > 5000 ? 100 : 50
  slider.min = step
  slider.max = Math.max(step * 2, Math.ceil(g.remaining / step) * step)
  slider.step = step
  slider.value = sliderValues[g.id] ?? (g.suggestedMonthly || Math.ceil(g.remaining / 12 / step) * step)
  const live = () => {
    const m = +slider.value
    sliderValues[g.id] = m
    paintSlider(slider)
    card.querySelector('[data-val]').textContent = money(m) + t('common.perMonth')
    const months = monthsToGoal(g.remaining, m)
    card.querySelector('[data-eta]').textContent = t('goal.eta', { time: duration(months), date: futureMonth(months) })
  }
  slider.addEventListener('input', live)
  card.querySelector('[data-suggest]')?.addEventListener('click', () => { slider.value = g.suggestedMonthly; live() })
  card.querySelector('[data-addsaved]').addEventListener('submit', (e) => {
    e.preventDefault()
    const amt = formData(e.target, ['amount']).amount
    if (amt <= 0) return
    update((s) => { const x = s.goals.find((y) => y.id === g.id); x.saved = Math.min(x.cost, x.saved + amt) })
    toast('🎉 +' + money(amt))
  })
  live()
}
