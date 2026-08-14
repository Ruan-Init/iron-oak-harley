import { useState } from "react";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";
import { authClient } from "../lib/auth";

type Mode = "entrar" | "criar";

export default function SignInPage() {
  const { data: session, isPending } = authClient.useSession();
  const [mode, setMode] = useState<Mode>("entrar");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"email" | "google" | null>(null);

  if (!isPending && session) return <Redirect to="/minha-conta" />;

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading("email");
    const result =
      mode === "entrar"
        ? await authClient.signIn.email({
            email: form.email,
            password: form.password,
          })
        : await authClient.signUp.email({
            name: form.name,
            email: form.email,
            password: form.password,
          });
    setLoading(null);
    if (result.error) {
      setError(
        result.error.message ??
          "Não foi possível continuar. Confira os dados e tente de novo.",
      );
    }
  }

  async function google() {
    setError(null);
    setLoading("google");
    const result = await authClient.managedAuth.signIn({ provider: "google" });
    setLoading(null);
    if (result.error && result.error.code !== "POPUP_CLOSED") {
      setError(result.error.message ?? "Falha ao entrar com o Google.");
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-2">
      <div className="flex items-center border-b border-line px-6 py-16 sm:px-10 lg:border-b-0 lg:border-r lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="label enter flex items-center gap-3 text-muted">
            <span className="h-px w-8 bg-current opacity-40" />
            Área do piloto
          </div>
          <h1
            className="t-h2 enter mt-6 text-[clamp(2rem,4vw,3rem)]"
            style={{ "--delay": "80ms" } as React.CSSProperties}
          >
            {mode === "entrar" ? "Entrar" : "Criar conta"}
          </h1>
          <p
            className="enter mt-5 text-[0.9375rem] leading-relaxed text-muted"
            style={{ "--delay": "140ms" } as React.CSSProperties}
          >
            Acompanhe pedidos, test rides agendados e sua garagem salva.
          </p>

          <div
            className="enter mt-9 flex gap-2"
            style={{ "--delay": "180ms" } as React.CSSProperties}
          >
            {(["entrar", "criar"] as const).map((item) => (
              <button
                key={item}
                type="button"
                className="chip"
                data-active={mode === item}
                onClick={() => {
                  setMode(item);
                  setError(null);
                }}
              >
                {item === "entrar" ? "Já tenho conta" : "Sou novo aqui"}
              </button>
            ))}
          </div>

          <form
            onSubmit={submit}
            className="enter mt-9 space-y-6"
            style={{ "--delay": "220ms" } as React.CSSProperties}
          >
            {mode === "criar" ? (
              <label className="block">
                <span className="label text-muted">Nome completo</span>
                <input
                  aria-label="Nome completo"
                  required
                  minLength={3}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="field mt-2"
                  placeholder="Ruan Carlos Almeida"
                />
              </label>
            ) : null}
            <label className="block">
              <span className="label text-muted">E-mail</span>
              <input
                aria-label="E-mail"
                required
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="field mt-2"
                placeholder="voce@email.com"
              />
            </label>
            <label className="block">
              <span className="label text-muted">Senha</span>
              <input
                aria-label="Senha"
                required
                type="password"
                minLength={8}
                autoComplete={
                  mode === "entrar" ? "current-password" : "new-password"
                }
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="field mt-2"
                placeholder="Mínimo de 8 caracteres"
              />
            </label>

            {error ? (
              <p className="border-l-2 border-orange pl-4 text-[0.875rem] text-graphite">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading !== null}
              className="btn btn-primary w-full"
            >
              {loading === "email" ? (
                <>
                  <Loader2 className="spin size-4" />
                  Aguarde…
                </>
              ) : mode === "entrar" ? (
                "Entrar"
              ) : (
                "Criar minha conta"
              )}
            </button>
          </form>

          <div
            className="enter mt-8 flex items-center gap-4"
            style={{ "--delay": "260ms" } as React.CSSProperties}
          >
            <span className="h-px flex-1 bg-line" />
            <span className="label text-muted">ou</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <button
            type="button"
            onClick={google}
            disabled={loading !== null}
            className="btn btn-outline enter mt-8 w-full"
            style={{ "--delay": "300ms" } as React.CSSProperties}
          >
            {loading === "google" ? (
              <>
                <Loader2 className="spin size-4" />
                Abrindo Google…
              </>
            ) : (
              "Continuar com Google"
            )}
          </button>

          <p
            className="enter mt-8 text-[0.8125rem] leading-relaxed text-muted"
            style={{ "--delay": "340ms" } as React.CSSProperties}
          >
            Ao continuar você concorda com os termos de uso e a política de
            privacidade da Iron & Oak.
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <img
          src="/images/lifestyle-night.jpg"
          alt="Piloto em estrada aberta"
          className="h-full w-full object-cover opacity-85"
        />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="serif max-w-md text-[1.5rem] leading-snug text-bone">
            “A estrada não pergunta de onde você vem. Só quer saber se você
            aguenta o próximo quilômetro.”
          </p>
          <div className="label mt-6 text-bone/50">Diário de bordo, 2026</div>
        </div>
      </div>
    </div>
  );
}
