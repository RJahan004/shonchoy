/** SETTINGS: language, edit income, export JSON (exact schema), load demo, reset */
import { exportJSON, replaceState, emptyState, SCHEMA_EXAMPLE } from '../store.js'
import { t, languageToggle, lang } from '../i18n.js'

export default {
  render(el, state, _plan, ctx) {
    el.innerHTML = `
    <div class="container container--narrow">
      <header class="screen-head"><h1>${t('set.title')}</h1></header>
      <div class="card stack">
        <div class="row row--between"><span class="text-strong">${t('lang.label')}</span>${languageToggle()}</div>
        <button class="btn btn--secondary btn--block" id="s-income"><i class="fa-solid fa-wallet"></i> ${t('set.editIncome')}</button>
        <button class="btn btn--ghost btn--block" id="s-export"><i class="fa-solid fa-download"></i> ${t('set.export')}</button>
        <button class="btn btn--ghost btn--block" id="s-demo"><i class="fa-solid fa-flask"></i> ${t('set.demo')}</button>
        <button class="btn btn--danger btn--block" id="s-reset"><i class="fa-solid fa-trash-can"></i> ${t('set.reset')}</button>
        <p class="text-sm muted"><i class="fa-solid fa-lock"></i> ${t('set.privacy')}</p>
      </div>
      <details class="card" style="margin-top:var(--space-4)">
        <summary class="text-strong" style="cursor:pointer">JSON</summary>
        <pre style="white-space:pre-wrap;font-size:12px;margin:var(--space-3) 0 0;overflow:auto;max-height:360px">${exportJSON().replace(/</g, '&lt;')}</pre>
      </details>
    </div>`

    el.querySelector('#s-income').addEventListener('click', () => ctx.go('income'))
    el.querySelector('#s-export').addEventListener('click', () => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(new Blob([exportJSON()], { type: 'application/json' }))
      a.download = 'shonchoy-data.json'
      a.click()
      URL.revokeObjectURL(a.href)
    })
    el.querySelector('#s-demo').addEventListener('click', () => {
      replaceState({ ...structuredClone(SCHEMA_EXAMPLE), user: { ageConfirmed: true, language: lang() } }); ctx.go('home')
    })
    el.querySelector('#s-reset').addEventListener('click', () => {
      if (confirm(t('set.resetConfirm'))) { replaceState(emptyState(lang())); ctx.go('welcome') }
    })
  }
}
