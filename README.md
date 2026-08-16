# Iron & Oak

Monorepo com frontend web, app mobile e shell desktop, montado com Bun + Turbo.

## Visão geral

Este projeto é uma loja de motos Harley-Davidson demo com:

- web em React + Vite
- API em Hono + oRPC
- banco local SQLite via Drizzle/LibSQL
- páginas de catálogo, peças, blog, checkout e test ride
- desktop e mobile como clientes do mesmo backend

## Stack

- Bun
- Vite
- React + TypeScript
- TanStack Query
- Hono + oRPC
- Drizzle ORM
- SQLite local para desenvolvimento

## Requisitos

- Bun 1.3+
- Node 20+
- Git

## Configuração local

1. Instale as dependências na raiz do projeto:

```bash
bun install
```

2. Crie um arquivo `.env` na raiz do repositório. Ele é local e não entra no Git.

```env
NODE_ENV=development
WEBSITE_URL=http://localhost:4200
APPLICATION_ID=
BETTER_AUTH_SECRET=dev-secret
DATABASE_URL=file:./.data/iron-oak.db
DATABASE_AUTH_TOKEN=
AI_GATEWAY_BASE_URL=
AI_GATEWAY_API_KEY=
AUTUMN_SECRET_KEY=
```

> O projeto foi configurado para usar SQLite local em desenvolvimento. Isso evita depender de Turso ou de credenciais externas para rodar a loja localmente.

3. Crie a pasta do banco e aplique o schema:

```bash
cd packages/web
mkdir -p .data
bun --env-file=../../.env drizzle-kit push
```

4. Popule os dados do catálogo:

```bash
bun --env-file=../../.env src/api/database/seed.ts
```

## Rodando o app

### Web

```bash
cd packages/web
bun x vite --host 0.0.0.0 --port 4200
```

Abra:

- http://localhost:4200

### Scripts úteis

Na raiz:

```bash
bun run dev
bun run build
bun run typecheck
bun run lint
```

No pacote web:

```bash
cd packages/web
bun run build
bun run typecheck
bun run start
```

## Banco de dados

O banco local fica em:

- `packages/web/.data/iron-oak.db`

Comandos principais:

```bash
cd packages/web
bun --env-file=../../.env drizzle-kit push
bun --env-file=../../.env drizzle-kit generate
bun --env-file=../../.env drizzle-kit migrate
```

## Observações importantes

- Não use `bunx` em scripts do projeto; o comando correto é `bun x`.
- O arquivo `.env` fica ignorado pelo Git conforme o `.gitignore`.
- O diretório `node_modules` também é ignorado.
- A autenticação externa do Runable é opcional em desenvolvimento; se não houver credenciais, o app continua funcionando localmente com fallback seguro.

## Estrutura principal

```text
.
├── .env                    # variáveis locais, gitignored
├── packages/
│   ├── web/                # app web + API + banco
│   ├── mobile/             # app Expo
│   └── desktop/            # shell Electron
├── package.json
├── turbo.json
└── README.md
```

## Dicas

- Sempre rode os comandos no diretório correto; alguns scripts dependem do `.env` na raiz.
- Se a porta `4200` estiver ocupada, o Vite pode trocar para outra porta automaticamente.
- Em desenvolvimento, `http://localhost:4200/api/health` deve responder com `{"status":"ok"}`.

