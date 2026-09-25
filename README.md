# $honchoy (সঞ্চয়)

**Savings & money planning for women, in English and বাংলা.**
"Shonchoy" means *savings* in Bangla.

A calm, private budgeting app: onboarding (18+ gate, income), expenses & debts, an automatic monthly plan,
an emergency fund, goals, investment *education*, a dashboard with a health score, lessons and a scam checker.

- **Stack:** plain HTML + CSS + ES-module JavaScript. **No build step, no framework, no backend.**
- **Data:** stays in the user's browser (`localStorage`, key `shonchoy:v1`). Nothing is sent to a server.
- **Hosting:** any static host (Vercel, Netlify, Cloudflare Pages). `public/` is the site.

## Features
| Module | Screen / file | Status |
|---|---|---|
| 18+ confirmation (boolean only, no age stored) | `screens/onboarding-age.js` | ✅ |
| Income type (monthly / yearly / irregular) + multiple sources | `screens/onboarding-income.js` | ✅ |
| Bangla / English toggle (stored as `user.language`) | `i18n.js` → `languageToggle()` | ✅ |
| Expenses (fixed / variable, category) | `screens/money.js` | ✅ |
| Debts: DTI flag (>30% caution, >40% high risk), high-interest flag, payoff timeline + slider calculator | `screens/money.js`, `engine.js` | ✅ |
| Auto budget: disposable → debt carve-out → emergency / goals / flexible | `screens/plan.js`, `engine.js → computePlan()` | ✅ |
| Savings log (counts toward emergency fund) | `screens/plan.js` | ✅ |
| Emergency fund: 3 months of essentials (6 if irregular) | `screens/goals.js` | ✅ |
| Custom goals + live timeline slider | `screens/goals.js` | ✅ |
| Investment guidance (rule-based, educational, no products) | `engine.js → investmentGuidance()` | ✅ |
| Dashboard: income vs expenses, progress, health score 0–100, 3 insights | `screens/dashboard.js` | ✅ |
| 8 lesson cards + scam red-flag checker | `screens/learn.js` | ✅ |
| Export JSON / load demo / reset | `screens/settings.js` | ✅ |

## Routes (hash-based)
`#/welcome` · `#/income` · `#/home` · `#/money` · `#/plan` · `#/goals` · `#/learn` · `#/settings`
Add `?demo` to the URL (e.g. `/?demo`) to load the sample data instantly. Useful for demos.

## Data schema (exact team shape)
```json
{
  "app": "$honchoy",
  "user": { "ageConfirmed": true, "language": "en" },
  "income": { "type": "monthly", "sources": [{ "name": "salary", "amount": 20000 }] },
  "expenses": [{ "category": "rent", "name": "House rent", "amount": 6000, "type": "fixed" }],
  "debts": [{ "type": "microloan", "amount": 5000, "interestRate": 20, "minMonthlyPayment": 500 }],
  "goals": [{ "id": "g1", "name": "Sewing machine", "cost": 15000, "saved": 3000, "type": "custom" }],
  "logs": [{ "date": "2026-09-25", "amount": 1000, "note": "" }]
}
```
Allowed values (`store.js → ENUMS`):
- `income.type`: `monthly | yearly | irregular`. Irregular = "typical month" amounts.
- income source `name`: free text, or one of `salary | freelancing | business | scholarship | other` (shown translated)
- `expenses[].type`: `fixed | variable`; `category`: `rent food utilities transport health education family personal other`
- `debts[].type`: `bank | microloan | informal | credit`; `interestRate` = % per year
- `goals[].type`: `education | business | purchase | travel | custom`
- `logs[]`: money set aside; the sum is the emergency-fund balance.

## Project structure
```
public/
  index.html            app shell (header, nav, #app)
  img/logo.svg          scalloped petal-coin logo
  css/tokens.css        DESIGN TOKENS (colours, fonts, spacing, radii, shadows)
  css/components.css    reusable classes: .btn .card .progress .field .check .pill .alert …
  css/app.css           shell + screen-specific layout
  js/store.js           state (exact schema), localStorage, update()/subscribe()
  js/engine.js          ALL financial maths (pure functions, unit-tested)
  js/i18n.js            EN + BN strings, t(), money(), language toggle
  js/ui.js              helpers: esc(), progressBar(), toast() …
  js/app.js             router: plug screens in here
  js/screens/*.js       one file per screen
tests/engine.test.js    `npm test` (Node 20+)
docs/                   TEAM_GUIDE.md, DEMO_SCRIPT.md, DEPLOY.md
```

## Local development
```bash
npm install
npm run dev:sandbox   # http://localhost:3000 (or open public/ with any static server, e.g. `npx serve public`)
npm test              # engine unit tests
```

## Deployment
See [`docs/DEPLOY.md`](docs/DEPLOY.md). `vercel.json` and `netlify.toml` are included: connect the GitHub repo and set the output/publish directory to `public` (no build command).

## Not yet implemented / next steps
- Optional cloud sync / accounts (currently single-device by design for privacy)
- Recurring monthly check-in reminders (PWA + notifications)
- Offline install (service worker / manifest)
- Monthly history charts from `logs`
- Review Bangla copy with native-speaker users; add more lesson cards
