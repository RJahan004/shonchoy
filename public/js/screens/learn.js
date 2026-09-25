/**
 * LEARN: 8 plain-language lesson cards + scam red-flag checker (no state writes)
 * Copy lives in i18n.js under l1…l8 (t = title, b = body, x = "try this") and scam.*
 */
import { t } from '../i18n.js'

const LESSONS = [
  { id: 'l1', icon: 'fa-piggy-bank' }, { id: 'l2', icon: 'fa-shield-heart' }, { id: 'l3', icon: 'fa-scale-balanced' },
  { id: 'l4', icon: 'fa-percent' }, { id: 'l5', icon: 'fa-hand-holding-dollar' }, { id: 'l6', icon: 'fa-arrow-trend-up' },
  { id: 'l7', icon: 'fa-seedling' }, { id: 'l8', icon: 'fa-basket-shopping' }
]
const FLAGS = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8']
const SEVERE = ['f1', 'f3', 'f5'] // any one of these alone = high risk
let openLesson = null
let ticked = new Set()

export default {
  render(el) {
    el.innerHTML = `
    <div class="container">
      <header class="screen-head"><h1>${t('learn.title')}</h1></header>
      <section class="stack" aria-labelledby="les-h">
        <div><h2 id="les-h">${t('learn.lessons')}</h2><p class="text-sm muted">${t('learn.lessonsSub')}</p></div>
        <div class="lesson-grid">
          ${LESSONS.map((l, i) => `
            <button type="button" class="lesson" data-lesson="${l.id}" aria-expanded="${openLesson === l.id}">
              <span class="row"><span class="lesson__icon"><i class="fa-solid ${l.icon}"></i></span><span class="lesson__num">${i + 1} / ${LESSONS.length}</span></span>
              <h3>${t(l.id + '.t')}</h3>
              <span class="lesson__body"><span style="display:block">${t(l.id + '.b')}</span>
                <span class="lesson__try" style="display:block"><strong>💡 ${t('learn.tryThis')}:</strong> ${t(l.id + '.x')}</span></span>
              <span class="text-sm" style="color:var(--color-primary-strong);font-weight:600">${openLesson === l.id ? t('learn.close') : t('learn.read') + ' →'}</span>
            </button>`).join('')}
        </div>
      </section>

      <section class="card stack" aria-labelledby="scam-h" style="margin-top:var(--space-8)">
        <div class="row"><span class="lesson__icon" style="background:linear-gradient(135deg,#f4768f,#c0344d)"><i class="fa-solid fa-user-secret"></i></span>
          <div><h2 id="scam-h">${t('scam.title')}</h2><p class="text-sm muted">${t('scam.subtitle')}</p></div></div>
        <div class="grid-2" style="gap:var(--space-2)">
          ${FLAGS.map((f) => `<label class="check check--danger"><input type="checkbox" data-flag="${f}" ${ticked.has(f) ? 'checked' : ''} /><span class="text-sm">${t('scam.' + f)}</span></label>`).join('')}
        </div>
        <div id="scam-result" aria-live="polite"></div>
        <div class="card card--soft" style="box-shadow:none">
          <h3 style="margin-bottom:var(--space-2)"><i class="fa-solid fa-shield" style="color:var(--color-primary)"></i> ${t('scam.tips')}</h3>
          <ul class="stack-sm text-sm" style="padding-left:1.1em;margin:0">${[1, 2, 3, 4].map((n) => `<li>${t('scam.tip' + n)}</li>`).join('')}</ul>
        </div>
      </section>
    </div>`

    el.querySelectorAll('[data-lesson]').forEach((b) => b.addEventListener('click', () => {
      openLesson = openLesson === b.dataset.lesson ? null : b.dataset.lesson
      this.render(el)
      el.querySelector(`[data-lesson="${b.dataset.lesson}"]`).focus()
    }))

    const result = () => {
      const n = ticked.size
      const level = n === 0 ? 0 : n >= 2 || [...ticked].some((f) => SEVERE.includes(f)) ? 2 : 1
      const cls = ['alert--success', 'alert--warn', 'alert--danger'][level]
      const ic = ['fa-circle-check', 'fa-triangle-exclamation', 'fa-hand'][level]
      el.querySelector('#scam-result').innerHTML = `<div class="alert ${cls} scam-meter"><i class="fa-solid ${ic}"></i><span>${t('scam.r' + level)}</span></div>`
    }
    el.querySelectorAll('[data-flag]').forEach((c) => c.addEventListener('change', () => {
      c.checked ? ticked.add(c.dataset.flag) : ticked.delete(c.dataset.flag); result()
    }))
    result()
  }
}
