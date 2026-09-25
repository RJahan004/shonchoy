/**
 * Small shared UI helpers used by every screen.
 * Screens render HTML strings, so ALWAYS pass user text through esc().
 */
import { t } from './i18n.js'

/** Escape user-entered text before putting it into HTML. */
export function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

/** Progress bar component. variant: '' | 'goals' | 'success' */
export function progressBar(ratio, { variant = '', label = '', size = '' } = {}) {
  const pct = Math.round(Math.min(1, Math.max(0, ratio || 0)) * 100)
  return `<div class="progress ${variant ? 'progress--' + variant : ''} ${size ? 'progress--' + size : ''}" role="progressbar"
    aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" ${label ? `aria-label="${esc(label)}"` : ''}>
    <div class="progress__bar" style="width:${pct}%"></div></div>`
}

/** <option> list from values with i18n prefix: options(['a','b'], 'exp.cat.', 'b') */
export function options(values, prefix, selected) {
  return values.map((v) => `<option value="${v}" ${v === selected ? 'selected' : ''}>${esc(t(prefix + v))}</option>`).join('')
}

/** Read a <form> into an object; numeric fields listed in `numbers` get converted. */
export function formData(form, numbers = []) {
  const o = Object.fromEntries(new FormData(form).entries())
  numbers.forEach((k) => { o[k] = parseFloat(String(o[k]).replace(/,/g, '')) || 0 })
  return o
}

/** Paint the filled part of a range slider (CSS var --fill). */
export function paintSlider(el) {
  const p = ((el.value - el.min) / (el.max - el.min || 1)) * 100
  el.style.setProperty('--fill', p + '%')
}

let toastTimer
export function toast(msg) {
  const el = document.getElementById('toast')
  if (!el) return
  el.textContent = msg
  el.classList.add('is-show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => el.classList.remove('is-show'), 2200)
}

/** Icon per category/type, kept here so every screen matches. */
export const ICONS = {
  rent: 'fa-house', food: 'fa-basket-shopping', utilities: 'fa-bolt', transport: 'fa-bus', health: 'fa-heart-pulse',
  education: 'fa-graduation-cap', family: 'fa-people-roof', personal: 'fa-spa', other: 'fa-circle-dot',
  bank: 'fa-building-columns', microloan: 'fa-hand-holding-dollar', informal: 'fa-people-arrows', credit: 'fa-cart-shopping',
  business: 'fa-store', purchase: 'fa-bag-shopping', travel: 'fa-plane', custom: 'fa-star',
  salary: 'fa-briefcase', freelancing: 'fa-laptop', scholarship: 'fa-award',
  monthly: 'fa-calendar-check', yearly: 'fa-calendar', irregular: 'fa-wave-square'
}
export const icon = (k) => `<i class="fa-solid ${ICONS[k] || 'fa-circle'}" aria-hidden="true"></i>`
