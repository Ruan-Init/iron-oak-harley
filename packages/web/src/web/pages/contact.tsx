import { useState } from "react";
import { Check, Clock, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "../components/layout";
import { Reveal } from "../components/reveal";
import { useDealers } from "../queries/dealers";
import { useSendContact } from "../queries/contact";

const SUBJECTS = [
  "Comprar uma moto",
  "Test ride",
  "Peças e acessórios",
  "Serviço e manutenção",
  "Outro assunto",
];

export default function ContactPage() {
  const dealers = useDealers();
  const send = useSendContact();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: SUBJECTS[0],
    message: "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    send.mutate(form, {
      onSuccess: () => setDone(true),
      onError: (err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível enviar. Tente novamente.",
        ),
    });
  }

  return (
    <>
      <PageHero
        eyebrow="Contato"
        title={
          <>
            Fale com a
            <br />
            oficina
          </>
        }
        intro="Respondemos em até um dia útil. Para test ride, use a agenda dedicada — é mais rápido."
      />

      <section className="shell py-16 md:py-24">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <div>
            {done ? (
              <div className="border border-line bg-bone-2 p-10">
                <span className="flex size-10 items-center justify-center rounded-full bg-orange text-white">
                  <Check className="size-5" strokeWidth={2.5} />
                </span>
                <h2 className="t-h3 mt-7 text-[1.5rem]">Mensagem enviada</h2>
                <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-muted">
                  Obrigado, {form.name.split(" ")[0]}. Nossa equipe responde no
                  e-mail {form.email} em até um dia útil.
                </p>
                <button
                  type="button"
                  className="btn btn-outline mt-9"
                  onClick={() => {
                    setDone(false);
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      subject: SUBJECTS[0],
                      message: "",
                    });
                  }}
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="label flex items-center gap-3 border-b border-line pb-4 text-muted">
                  <span className="text-orange">01</span> Sua mensagem
                </div>
                <div className="mt-7 grid gap-7 sm:grid-cols-2">
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
                  <label className="block">
                    <span className="label text-muted">E-mail</span>
                    <input
                      aria-label="E-mail"
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="field mt-2"
                      placeholder="voce@email.com"
                    />
                  </label>
                  <label className="block">
                    <span className="label text-muted">Telefone</span>
                    <input
                      aria-label="Telefone"
                      required
                      minLength={8}
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className="field mt-2"
                      placeholder="(11) 90000-0000"
                    />
                  </label>
                  <label className="block">
                    <span className="label text-muted">Assunto</span>
                    <select
                      aria-label="Assunto"
                      value={form.subject}
                      onChange={(e) => update("subject", e.target.value)}
                      className="field mt-2"
                    >
                      {SUBJECTS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="label text-muted">Mensagem</span>
                    <textarea
                      aria-label="Mensagem"
                      required
                      minLength={10}
                      rows={6}
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      className="field mt-2 resize-none"
                      placeholder="Conte o que você procura — modelo, ano, cor, orçamento."
                    />
                  </label>
                </div>

                {error ? (
                  <p className="mt-7 border-l-2 border-orange pl-4 text-[0.875rem] text-graphite">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={send.isPending}
                  className="btn btn-primary mt-9 w-full sm:w-auto"
                >
                  {send.isPending ? (
                    <>
                      <Loader2 className="spin size-4" />
                      Enviando…
                    </>
                  ) : (
                    "Enviar mensagem"
                  )}
                </button>
              </form>
            )}
          </div>

          <aside className="border-t border-line pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
            <div className="label text-muted">Atendimento direto</div>
            <ul className="mt-7 space-y-6">
              <li className="flex items-start gap-4">
                <Phone className="mt-0.5 size-4 shrink-0 text-orange" />
                <div>
                  <div className="text-[0.9375rem] text-ink">
                    +55 11 4000-1903
                  </div>
                  <div className="label mt-1.5 text-muted">
                    Seg a sáb, 9h às 19h
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Mail className="mt-0.5 size-4 shrink-0 text-orange" />
                <div>
                  <div className="text-[0.9375rem] text-ink">
                    contato@ironoak.com.br
                  </div>
                  <div className="label mt-1.5 text-muted">
                    Resposta em 1 dia útil
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Clock className="mt-0.5 size-4 shrink-0 text-orange" />
                <div>
                  <div className="text-[0.9375rem] text-ink">
                    Oficina sob agendamento
                  </div>
                  <div className="label mt-1.5 text-muted">
                    Revisão e customização
                  </div>
                </div>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-bone-2 py-16 md:py-24">
        <div className="shell">
          <div className="label flex items-center gap-3 text-muted">
            <span className="h-px w-8 bg-current opacity-40" />
            Concessionárias
          </div>
          <h2 className="t-h2 mt-5 max-w-2xl">Onde nos encontrar</h2>

          <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {dealers.isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i}>
                    <div className="skeleton aspect-[4/3] w-full" />
                    <div className="skeleton mt-6 h-5 w-2/3" />
                    <div className="skeleton mt-4 h-3 w-full" />
                  </div>
                ))
              : dealers.data?.map((dealer, i) => (
                  <Reveal key={dealer.id} delay={(i % 3) * 80}>
                    <div className="aspect-[4/3] overflow-hidden bg-bone">
                      <img
                        src={dealer.image}
                        alt={dealer.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="label mt-6 text-orange">
                      {dealer.city} · {dealer.state}
                    </div>
                    <h3 className="t-h3 mt-3 text-[1.125rem]">{dealer.name}</h3>
                    <div className="mt-5 space-y-3 text-[0.875rem] leading-relaxed text-muted">
                      <p className="flex items-start gap-3">
                        <MapPin className="mt-0.5 size-3.5 shrink-0 text-ink" />
                        {dealer.address}
                      </p>
                      <p className="flex items-start gap-3">
                        <Phone className="mt-0.5 size-3.5 shrink-0 text-ink" />
                        {dealer.phone}
                      </p>
                      <p className="flex items-start gap-3">
                        <Clock className="mt-0.5 size-3.5 shrink-0 text-ink" />
                        {dealer.hours}
                      </p>
                    </div>
                  </Reveal>
                ))}
          </div>
        </div>
      </section>
    </>
  );
}
