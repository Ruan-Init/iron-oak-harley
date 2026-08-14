import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "wouter";
import { Check, Clock, Loader2, MapPin } from "lucide-react";
import { PageHero } from "../components/layout";
import { Reveal } from "../components/reveal";
import { useMotorcycles } from "../queries/motorcycles";
import { useDealers } from "../queries/dealers";
import { useCreateTestRide } from "../queries/test-rides";
import { authClient } from "../lib/auth";
import { longDate } from "../lib/format";

const TIMES = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

function tomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export default function TestRidePage() {
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("moto");
  const bikes = useMotorcycles({ sort: "destaque" });
  const dealers = useDealers();
  const createRide = useCreateTestRide();
  const { data: session } = authClient.useSession();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    license: "A",
    date: tomorrow(),
    time: TIMES[1],
    notes: "",
  });
  const [motorcycleId, setMotorcycleId] = useState<number | null>(null);
  const [dealerId, setDealerId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name || session.user.name,
      email: prev.email || session.user.email,
    }));
  }, [session]);

  useEffect(() => {
    if (!bikes.data?.length || motorcycleId !== null) return;
    const match = preselected
      ? bikes.data.find((b) => b.slug === preselected)
      : undefined;
    setMotorcycleId(match?.id ?? bikes.data[0].id);
  }, [bikes.data, preselected, motorcycleId]);

  useEffect(() => {
    if (!dealers.data?.length || dealerId !== null) return;
    setDealerId(dealers.data[0].id);
  }, [dealers.data, dealerId]);

  const selectedBike = useMemo(
    () => bikes.data?.find((b) => b.id === motorcycleId),
    [bikes.data, motorcycleId],
  );
  const selectedDealer = useMemo(
    () => dealers.data?.find((d) => d.id === dealerId),
    [dealers.data, dealerId],
  );

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!motorcycleId || !dealerId) {
      setError("Escolha um modelo e uma concessionária.");
      return;
    }
    createRide.mutate(
      {
        ...form,
        notes: form.notes || undefined,
        motorcycleId,
        dealerId,
      },
      {
        onSuccess: () => setDone(true),
        onError: (err) =>
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível registrar o agendamento.",
          ),
      },
    );
  }

  if (done) {
    return (
      <div className="shell py-28 text-center md:py-36">
        <div className="enter mx-auto flex size-12 items-center justify-center rounded-full bg-orange text-white">
          <Check className="size-5" strokeWidth={3} />
        </div>
        <h1
          className="t-h2 enter mt-8"
          style={{ "--delay": "80ms" } as React.CSSProperties}
        >
          Test ride agendado
        </h1>
        <p
          className="enter mx-auto mt-7 max-w-xl text-[0.9375rem] leading-relaxed text-muted"
          style={{ "--delay": "140ms" } as React.CSSProperties}
        >
          {selectedBike?.name} em {selectedDealer?.name}, {longDate(form.date)} às{" "}
          {form.time}. Confirmamos por telefone algumas horas antes — leve CNH
          categoria A e roupa fechada.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/minha-conta" className="btn btn-primary">
            Ver na minha conta
          </Link>
          <Link to="/motos" className="btn btn-outline">
            Ver o catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Test ride"
        title={
          <>
            Quarenta minutos
            <br />
            no seu nome
          </>
        }
        intro="Sem custo, sem compromisso de compra. Escolha o modelo, a unidade e o horário — a gente prepara a moto e o capacete."
      />

      <div className="shell grid gap-14 py-16 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <form onSubmit={submit} className="space-y-14">
          {/* Model */}
          <fieldset>
            <legend className="label flex items-center gap-3 border-b border-line pb-4 text-muted">
              <span className="text-orange">01</span> Modelo
            </legend>
            {bikes.isLoading ? (
              <div className="skeleton mt-6 h-10 w-full" />
            ) : (
              <div className="mt-6 flex flex-wrap gap-2">
                {bikes.data?.map((bike) => (
                  <button
                    key={bike.id}
                    type="button"
                    className="chip"
                    data-active={motorcycleId === bike.id}
                    onClick={() => setMotorcycleId(bike.id)}
                  >
                    {bike.name}
                  </button>
                ))}
              </div>
            )}
          </fieldset>

          {/* Dealer */}
          <fieldset>
            <legend className="label flex items-center gap-3 border-b border-line pb-4 text-muted">
              <span className="text-orange">02</span> Concessionária
            </legend>
            {dealers.isLoading ? (
              <div className="skeleton mt-6 h-24 w-full" />
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {dealers.data?.map((dealer) => (
                  <button
                    key={dealer.id}
                    type="button"
                    onClick={() => setDealerId(dealer.id)}
                    className={`border p-5 text-left transition-colors ${
                      dealerId === dealer.id
                        ? "border-ink bg-bone-2"
                        : "border-line hover:border-muted"
                    }`}
                  >
                    <div className="text-[0.9375rem] font-semibold">
                      {dealer.name}
                    </div>
                    <div className="mt-1.5 flex items-start gap-2 text-[0.8125rem] text-muted">
                      <MapPin className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.8} />
                      {dealer.city} — {dealer.state}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </fieldset>

          {/* Date & time */}
          <fieldset>
            <legend className="label flex items-center gap-3 border-b border-line pb-4 text-muted">
              <span className="text-orange">03</span> Data e horário
            </legend>
            <div className="mt-6">
              <label className="block max-w-xs">
                <span className="label text-muted">Data</span>
                <input
                  aria-label="Data"
                  required
                  type="date"
                  min={tomorrow()}
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  className="field tnum mt-2"
                />
              </label>
              <div className="mt-7">
                <span className="label text-muted">Horário</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TIMES.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className="chip tnum"
                      data-active={form.time === time}
                      onClick={() => update("time", time)}
                    >
                      <Clock className="size-3" strokeWidth={2} />
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>

          {/* Contact */}
          <fieldset>
            <legend className="label flex items-center gap-3 border-b border-line pb-4 text-muted">
              <span className="text-orange">04</span> Contato
            </legend>
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
                  placeholder="Seu nome"
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
                  placeholder="(11) 99999-0000"
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
                <span className="label text-muted">Categoria da CNH</span>
                <select
                  aria-label="Categoria da CNH"
                  value={form.license}
                  onChange={(e) => update("license", e.target.value)}
                  className="field mt-2"
                >
                  <option value="A">A</option>
                  <option value="AB">AB</option>
                  <option value="Em processo">Em processo</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="label text-muted">Observações (opcional)</span>
                <textarea
                  aria-label="Observações (opcional)"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  className="field mt-2 resize-none"
                  placeholder="Quero comparar com a Low Rider S no mesmo dia"
                />
              </label>
            </div>
          </fieldset>

          {error ? (
            <p className="border-l-2 border-orange bg-bone-2 p-4 text-[0.875rem]">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={createRide.isPending}
            className="btn btn-primary w-full sm:w-auto"
          >
            {createRide.isPending ? (
              <>
                <Loader2 className="spin size-4" strokeWidth={2} />
                Enviando
              </>
            ) : (
              "Confirmar agendamento"
            )}
          </button>
        </form>

        <aside>
          <div className="sticky top-[96px]">
            {selectedBike ? (
              <Reveal>
                <div className="aspect-[4/3] overflow-hidden bg-bone-2">
                  <img
                    src={selectedBike.image}
                    alt={selectedBike.name}
                    className="multiply size-full object-cover"
                  />
                </div>
                <h2 className="t-h3 mt-6">{selectedBike.name}</h2>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-muted">
                  {selectedBike.tagline}
                </p>
              </Reveal>
            ) : null}

            <dl className="mt-8 space-y-3 border-t border-line pt-6 text-[0.875rem]">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Unidade</dt>
                <dd className="text-right font-semibold">
                  {selectedDealer?.name ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Quando</dt>
                <dd className="tnum text-right font-semibold">
                  {longDate(form.date)} · {form.time}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Duração</dt>
                <dd className="text-right">40 minutos</dd>
              </div>
            </dl>

            <p className="mt-7 text-[0.75rem] leading-relaxed text-muted">
              Obrigatório: CNH categoria A válida, calça comprida, calçado fechado e
              jaqueta. Fornecemos capacete e luvas.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
