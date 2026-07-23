# selby.studio

Parent-company site for **Selby Studio LLC** — a family venture studio in Santa Monica, CA.

## Pages

- `index.html` — the studio site (portfolio: Encore · PupMate · Everbound)
- `privacy.html` → served at `/privacy` (Stripe public-details Privacy Policy URL)
- `terms.html` → served at `/terms` (Stripe public-details Terms of Service URL)
- `vercel.json` — `cleanUrls: true` so the extensionless URLs work

## Deploying

Hosted on Vercel (team **Selby Studio**, project **selby-studio**). Static site — no build step.

Push to the connected GitHub repo (`keegan-dotcom/selby-studio`, via GitHub Desktop) and Vercel deploys automatically once the repo is connected in **Vercel → selby-studio → Settings → Git**.

## Stripe compliance URLs

Paste into each account's public details (Encore, PupMate, Everbound):

- Privacy: `https://selby.studio/privacy`
- Terms: `https://selby.studio/terms`
