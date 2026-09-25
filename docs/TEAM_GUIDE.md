# $honchoy: Team guide

## 1. Design tokens (use these, never raw values)
All in `public/css/tokens.css`.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#fff5f8` blush | page background |
| `--color-surface` | `#ffffff` | cards |
| `--color-primary` | `#e84f82` rose | buttons, progress, active states |
| `--color-primary-strong` | `#cf3a6c` | hover, pink text on white (AA) |
| `--color-primary-soft` | `#ffe4ec` | chips, secondary buttons |
| `--color-text` | `#3d1a33` deep plum | body text (**never black**) |
| `--color-text-2` / `--color-muted` | `#5e3252` / `#8a6180` | secondary / captions |
| `--color-success / warning / danger / info` | green / amber / red / violet | alerts & flags (+ `-soft` backgrounds) |
| `--color-emergency / goals / flexible` | rose / violet / apricot | the 3 budget buckets, everywhere |
| `--gradient-brand` | pink → rose → berry | logo, hero card, progress fill |
| `--font-display` | Baloo Da 2 | headings (supports Bangla) |
| `--font-body` | Hind Siliguri | text (supports Bangla) |
| `--space-1…12` | 4px scale | all padding/margins |
| `--radius-sm/md/lg/xl/pill` | 8/12/18/24/999 | inputs=md, cards=lg, buttons=pill |
| `--shadow-sm/md/lg` | plum-tinted | elevation |
| `--tap-min` | 44px | minimum touch target |

**Components** (`components.css`):
- Buttons: `.btn` + `--primary` / `--secondary` / `--ghost` / `--danger`, sizes `--sm` and `--block`
- Card: `.card` (`--soft`, `--brand`), `.card__head`
- Forms: `.field > .label + .input/.select`, `.form-grid`, `.choice-grid > .choice`, `.check`, `.segmented`, `.slider`
- Progress: `progressBar(ratio, {variant:'goals'|'success', size:'sm'})` from `ui.js`
- Other: `.alert--warn/danger/success`, `.pill`, `.list > .list-item`, `.stat`

## 2. Adding a screen
```js
// public/js/screens/my-screen.js
import { update } from '../store.js'
import { t, money } from '../i18n.js'
import { esc } from '../ui.js'

export default {
  render(el, state, plan, ctx) {   // plan = computePlan(state)
    el.innerHTML = `<div class="container"><h1>${t('my.title')}</h1> …</div>`
    el.querySelector('form').addEventListener('submit', e => {
      e.preventDefault()
      update(s => { s.goals.push({ … }) })   // the screen re-renders automatically
    })
  }
}
```
Then register it in `js/app.js` → `ROUTES` (and `NAV` if it needs a tab).

Rules:
1. **All copy through `t('key')`**. Add the key to both `en` and `bn` in `i18n.js`.
2. **User text through `esc()`** before putting it in HTML.
3. **Numbers from `engine.js`**. Don't recalculate in screens.
4. **Money via `money(n)`**. It gives ৳ with South-Asian grouping, and Bangla digits in BN.
5. Live controls (sliders) update the DOM directly; call `update()` only on commit.

## 3. Language
- Stored as `state.user.language` = `'en' | 'bn'`. Default follows the browser language.
- Toggle: `languageToggle()` returns the EN | বাং segmented control. Any `[data-set-lang]` button works.
- `<html lang>` is updated, so `:lang(bn)` CSS tweaks work (e.g. no uppercase labels in Bangla).

## 4. Engine rules (tweak in `engine.js → RULES`)
- DTI: >30% caution, >40% high risk
- High interest: bank >16%, MFI/informal/credit >24%, anything >36%
- Emergency target: 3 × essentials (fixed + essential-category variable); 6 × if income is irregular
- Split of the leftover `[emergency, goals, flexible]`: <50% funded `60/20/20`, 50–99% `40/35/25`, full `0/65/35`
- High-interest debt → 15% of the leftover goes to extra debt payments
- Health score = cash flow 20 + saving rate 25 + debt 25 + emergency fund 20 + goals 10
