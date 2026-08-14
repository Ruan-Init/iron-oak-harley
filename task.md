# Iron & Oak — progresso

## Feito
- Backend completo (schema, auth, rotas catalog/cart/engagement, index) + `db:push` + seed rodado (10 motos, 8 peças, 5 dealers, 6 posts).
- Imagens em `packages/web/public/images/` (27).
- `index.html` (fontes Anton/Manrope/Instrument Serif), `styles.css` (tokens + utilitários + motion).
- libs: `auth.ts`, `api.ts` (bearer), `cart-key.ts`, `format.ts`; `main.tsx` com handleRedirect.
- queries: motorcycles, parts, blog, dealers, cart, checkout, test-rides, contact, account.
- components: reveal, section, header, footer, layout(+PageHero), bike-card, part-card.
- pages: index, motorcycles, motorcycle.

## Falta
- pages: parts, cart, checkout, order, test-ride, blog, post, contact, sign-in, account
- components/protected-route.tsx
- app.tsx com todas as rotas + Layout (manter AgentFeedback e RunableBadge)
- `bun run lint` / `typecheck` / `build` na raiz
- `bun run dev --port 4200` + revisão visual + `deliver`

## Notas
- bunx que precisa de DB: `set -a && . ../../.env && set +a && bunx ...`
- Preços em centavos BRL. Cart via `cartKey` (localStorage).
