# Deploying $honchoy

The app is a static site in `public/`. There is **no build step**.

## Option A: Vercel (connected to GitHub)
1. Push the repo to GitHub (branch `main`).
2. vercel.com → **Add New → Project** → import the repo.
3. Framework preset: **Other**. Build command: *(empty)*. Output directory: **`public`**. (`vercel.json` already sets this.)
4. Deploy. Every push to `main` goes to production, and every PR gets a preview URL.

## Option B: Netlify (connected to GitHub)
1. app.netlify.com → **Add new site → Import an existing project** → GitHub → pick the repo.
2. Branch `main`. Build command: *(empty)*. Publish directory: **`public`**. (`netlify.toml` already sets this.)
3. Deploy. Pushes auto-deploy, and PRs get deploy previews.

## CLI alternative
```bash
npx vercel --prod            # from repo root
npx netlify deploy --prod --dir=public
```

## Pre-launch checklist
- [ ] `npm test` passes
- [ ] Open `/?demo` and click through every tab in **EN and বাং**
- [ ] Check on a real phone (375px wide): no sideways scrolling, all buttons tappable
- [ ] Settings → "Download my data" returns JSON in the team schema
- [ ] Settings → "Delete all my data" returns to the welcome screen
