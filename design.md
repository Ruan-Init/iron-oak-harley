# Iron & Oak — Harley-Davidson Store — Design

Ecommerce editorial e minimalista para motocicletas Harley-Davidson, peças e acessórios, agendamento de test ride, blog e concessionárias. Plataforma: **web** (o mesmo bundle roda no shell desktop, se necessário). Idioma da interface: **português (BR)**.

Direção visual: papel off-white, tipografia de pôster, muito respiro, faixas escuras de contraste, laranja Harley usado como pontuação — nunca como preenchimento. Fotos de moto em fundo branco entram com `mix-blend-mode: multiply` para "fundir" no papel. Zero card genérico arredondado: separação por hairlines e grid.

## Brand & Colors

Tokens em `packages/web/src/web/styles.css` (CSS variables + `@theme inline`).

| Token | Valor | Uso |
|-------|-------|-----|
| `--bone` | `#F4F1EC` | Fundo principal (papel) |
| `--bone-2` | `#EAE5DC` | Faixas alternadas, hover |
| `--ink` | `#121110` | Texto principal e seções escuras |
| `--graphite` | `#26241F` | Superfícies escuras secundárias |
| `--orange` | `#F26522` | Preço, CTA primário, badges, sublinhado |
| `--muted` | `#8A857B` | Texto secundário, labels |
| `--line` | `#D8D2C7` | Hairlines (1px), divisores de grid |

Regras: no máximo um elemento laranja preenchido por bloco visível. Texto sobre escuro usa `--bone`. Nenhum gradiente colorido; apenas véus preto/transparente sobre foto.

## Typography

- **Display**: `Anton` — títulos, números, eyebrow de seção. Sempre `uppercase`, `letter-spacing: -0.02em` nos tamanhos grandes, `line-height: 0.9`.
- **Body/UI**: `Manrope` — parágrafos, labels, botões, tabelas.
- **Accent**: `Instrument Serif` *itálico* — citações, depoimentos, legendas editoriais.
- Escala: hero `clamp(3.5rem, 11vw, 10rem)`; h2 `clamp(2rem, 5vw, 4rem)`; corpo `1rem/1.7`; label `0.6875rem` uppercase `tracking-[0.18em]`.
- Fontes carregadas via Google Fonts em `packages/web/index.html`.

## Layout

- Container: `max-w-[1400px]`, padding lateral `clamp(1.25rem, 5vw, 5rem)`.
- Grid assimétrico de 12 colunas; títulos frequentemente ocupam 7 colunas com a foto sangrando na borda oposta.
- Hairlines de 1px (`--line`) em vez de sombras. Raio de borda: `0` quase sempre (pill apenas em chips de filtro).
- Faixas escuras (`--ink`) full-bleed para engenharia/manifesto e footer.
- Barra fixa inferior na página de modelo (preço + comprar + test ride).

## Motion

Um load orquestrado por página: reveal escalonado (`opacity/translateY`) via CSS keyframes com `--delay`, e `IntersectionObserver` mínimo (`.reveal` → `.is-visible`) para seções abaixo da dobra. Hover: underline que cresce, imagem com `scale(1.03)` em 600ms.

## Pages

Rotas em `packages/web/src/web/app.tsx`, componentes em `src/web/pages/`.

- **/** `index.tsx` — hero com moto em cutout, modelos em destaque, faixa escura de engenharia, comparativo de especificações, acessórios, depoimentos, blog, CTA test ride.
- **/motos** `motorcycles.tsx` — catálogo com filtros (família, preço, cilindrada, ano) e ordenação.
- **/motos/:slug** `motorcycle.tsx` — galeria, specs, cores, financiamento estimado, add to cart, test ride, barra fixa.
- **/acessorios** `parts.tsx` — grid por categoria.
- **/carrinho** `cart.tsx` — itens, quantidades, resumo.
- **/checkout** `checkout.tsx` — dados, endereço, pagamento simulado → cria pedido.
- **/pedido/:code** `order.tsx` — confirmação.
- **/test-ride** `test-ride.tsx` — agendamento (modelo, concessionária, data, hora).
- **/blog**, **/blog/:slug** `blog.tsx`, `post.tsx` — lista editorial e leitura.
- **/contato** `contact.tsx` — formulário + concessionárias.
- **/entrar** `sign-in.tsx` — Google (managed auth) + e-mail/senha, abas entrar/criar.
- **/minha-conta** `account.tsx` — protegida: pedidos e test rides do usuário.

## Key Flows

1. Home → catálogo → modelo → adicionar ao carrinho → carrinho → checkout → pedido confirmado (número do pedido).
2. Modelo → agendar test ride → confirmação (registro no banco, aparece em Minha conta se logado).
3. Contato → lead salvo no banco.
4. Entrar com Google ou e-mail/senha → Minha conta mostra pedidos e test rides.

## Architecture

- **API**: oRPC em `packages/web/src/api/routes/` (`motorcycles`, `parts`, `cart`, `orders`, `testRides`, `blog`, `contact`, `dealers`), Drizzle + Turso.
- **Carrinho**: identificado por `cartKey` (UUID em `localStorage`); ao finalizar, o pedido é vinculado ao usuário logado quando existir.
- **Auth**: Better Auth + `@runablehq/managed-auth` (Google) e e-mail/senha. `/minha-conta` protegida.
- **Queries**: hooks em `src/web/queries/`, um arquivo por feature, com `@tanstack/react-query`.
