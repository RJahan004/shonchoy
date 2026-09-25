/**
 * ONBOARDING STEP 1: Welcome + 18+ confirmation
 * Writes ONLY: state.user.ageConfirmed = true   (no age / DOB is ever asked or stored)
 * Language can be picked here too (state.user.language).
 */
import { update, replaceState, SCHEMA_EXAMPLE } from '../store.js'
import { t, languageToggle } from '../i18n.js'

export function stepDots(n, total) {
  return `<div class="ob-steps" aria-hidden="true">${Array.from({ length: total }, (_, i) => `<span class="${i < n ? 'is-done' : ''}"></span>`).join('')}</div>
    <p class="text-xs muted">${t('ob.step', { n, total })}</p>`
}

export default {
  render(el, state, _plan, ctx) {
    el.innerHTML = `
    <section class="container container--narrow ob-wrap" aria-labelledby="age-title">
      ${stepDots(1, ctx.steps)}
      <div class="card stack-lg" style="margin-top:var(--space-4)">
        <div class="row row--between"><span></span>${languageToggle()}</div>
        <div style="text-align:center">
          <img src="/img/logo.svg" class="hero-coin" alt="" />
          <h1 id="age-title">${t('age.title')}</h1>
          <p class="muted" style="margin-top:var(--space-2)">${t('age.subtitle')}</p>
        </div>
        <ul class="feature-list">
          <li><i class="fa-solid fa-calculator"></i>${t('age.point1')}</li>
          <li><i class="fa-solid fa-shield-heart"></i>${t('age.point2')}</li>
          <li><i class="fa-solid fa-seedling"></i>${t('age.point3')}</li>
        </ul>
        <form id="age-form" class="stack" novalidate>
          <label class="check" for="age-ok">
            <input type="checkbox" id="age-ok" name="ageConfirmed" ${state.user.ageConfirmed ? 'checked' : ''} aria-describedby="age-privacy age-error" />
            <span class="text-strong">${t('age.checkbox')}</span>
          </label>
          <p id="age-privacy" class="text-sm muted"><i class="fa-solid fa-lock"></i> ${t('age.privacy')}</p>
          <p id="age-error" class="form-error" role="alert"></p>
          <button type="submit" class="btn btn--primary btn--block">${t('age.start')} <i class="fa-solid fa-arrow-right"></i></button>
          <button type="button" id="demo-btn" class="btn btn--ghost btn--block btn--sm">${t('age.demo')}</button>
        </form>
      </div>
    </section>`

    el.querySelector('#age-form').addEventListener('submit', (e) => {
      e.preventDefault()
      if (!el.querySelector('#age-ok').checked) {
        el.querySelector('#age-error').textContent = t('age.needConfirm')
        el.querySelector('#age-ok').focus()
        return
      }
      update((s) => { s.user.ageConfirmed = true })
      ctx.go('income')
    })
    el.querySelector('#demo-btn').addEventListener('click', () => {
      if (!el.querySelector('#age-ok').checked) {
        el.querySelector('#age-error').textContent = t('age.needConfirm')
        return
      }
      replaceState({ ...structuredClone(SCHEMA_EXAMPLE), user: { ageConfirmed: true, language: state.user.language } })
      ctx.go('home')
    })
  }
}
