/**
 * $honchoy app shell + hash router
 * ---------------------------------------------------------------
 * HOW TO PLUG IN A SCREEN (for teammates):
 *
 *   1. Create js/screens/my-screen.js exporting:
 *        export default {
 *          render(el, state, plan) {   // el = a fresh <div> for this screen
 *            el.innerHTML = `...`       // use t('key') for all copy
 *            el.querySelector('form').addEventListener(...)
 *          }
 *        }
 *      `plan` = computePlan(state) from engine.js (all the numbers, already calculated).
 *   2. Add it to ROUTES below (and to NAV if it needs a tab).
 *   3. Change data only via update(s => {...}) from store.js. The screen
 *      is re-rendered automatically with the new state.
 *   4. For live UI (sliders, typing), update the DOM directly and call
 *      update() only when the user commits, so inputs keep focus.
 */
import { getState, subscribe, replaceState, SCHEMA_EXAMPLE } from './store.js'
import { computePlan } from './engine.js'
import { t, applyI18n, languageToggle, setLanguage } from './i18n.js'

import welcome from './screens/onboarding-age.js'
import income from './screens/onboarding-income.js'
import dashboard from './screens/dashboard.js'
import money from './screens/money.js'
import plan from './screens/plan.js'
import goals from './screens/goals.js'
import learn from './screens/learn.js'
import settings from './screens/settings.js'

const ROUTES = {
  welcome: { screen: welcome, onboarding: true, step: 1 },
  income: { screen: income, onboarding: true, step: 2 },
  home: { screen: dashboard },
  money: { screen: money },
  plan: { screen: plan },
  goals: { screen: goals },
  learn: { screen: learn },
  settings: { screen: settings }
}
export const ONBOARDING_STEPS = 2

const NAV = [
  { id: 'home', icon: 'fa-house', key: 'nav.home' },
  { id: 'money', icon: 'fa-wallet', key: 'nav.money' },
  { id: 'plan', icon: 'fa-chart-pie', key: 'nav.plan' },
  { id: 'goals', icon: 'fa-bullseye', key: 'nav.goals' },
  { id: 'learn', icon: 'fa-book-open', key: 'nav.learn' }
]

const appEl = document.getElementById('app')
let currentRoute = null

/** Decide which route to show, sending unfinished users back to onboarding. */
function resolveRoute() {
  const s = getState()
  let id = location.hash.replace(/^#\/?/, '').split('?')[0] || 'home'
  if (!ROUTES[id]) id = 'home'
  if (!s.user.ageConfirmed) return 'welcome'
  if (!ROUTES[id].onboarding && s.income.sources.length === 0) return 'income'
  if (id === 'welcome') return 'home'
  return id
}

export function go(id) {
  if (location.hash === '#/' + id) render()
  else location.hash = '#/' + id
}

function renderChrome(routeId) {
  const nav = (cls) => NAV.map((n) => `<a href="#/${n.id}" class="${routeId === n.id ? 'is-active' : ''}"
      ${routeId === n.id ? 'aria-current="page"' : ''}><i class="fa-solid ${n.icon}" aria-hidden="true"></i><span>${t(n.key)}</span></a>`).join('')
  document.getElementById('top-nav').innerHTML = nav()
  document.getElementById('bottom-nav').innerHTML = nav()
  document.getElementById('lang-slot').innerHTML = languageToggle()
  document.body.classList.toggle('is-onboarding', !!ROUTES[routeId].onboarding)
}

function render() {
  const routeId = resolveRoute()
  const wantHash = '#/' + routeId
  if (location.hash !== wantHash) history.replaceState(null, '', wantHash)
  const changed = routeId !== currentRoute
  currentRoute = routeId

  const state = getState()
  const el = document.createElement('div')
  el.className = 'screen screen--' + routeId
  ROUTES[routeId].screen.render(el, state, computePlan(state), { go, route: ROUTES[routeId], steps: ONBOARDING_STEPS })
  appEl.replaceChildren(el)
  renderChrome(routeId)
  applyI18n(document)
  if (changed) { window.scrollTo(0, 0); appEl.focus({ preventScroll: true }) }
}

// Global: language toggle buttons anywhere in the page
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-set-lang]')
  if (b) setLanguage(b.dataset.setLang)
})

window.addEventListener('hashchange', render)
subscribe(render)

// Dev helper: ?demo in the URL loads the schema's sample data
if (new URLSearchParams(location.search).has('demo')) {
  replaceState(SCHEMA_EXAMPLE)
  history.replaceState(null, '', location.pathname + '#/home')
}
render()
