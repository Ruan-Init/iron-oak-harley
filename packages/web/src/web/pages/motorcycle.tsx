import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Reveal } from "../components/reveal";
import { BikeCard } from "../components/bike-card";
import { useMotorcycle } from "../queries/motorcycles";
import { getCartKey, useAddToCart } from "../queries/cart";
import { decimal, installment, money, moneyExact } from "../lib/format";

export default function MotorcyclePage() {
  const { slug } = useParams<{ slug: string }>();
  const query = useMotorcycle(slug);
  const addToCart = useAddToCart();
  const [colorIndex, setColorIndex] = useState(0);
  const [shotIndex, setShotIndex] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setColorIndex(0);
    setShotIndex(0);
    setAdded(false);
  }, [slug]);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 2400);
    return () => clearTimeout(timer);
  }, [added]);

  if (query.isLoading) {
    return (
      <div className="shell py-24">
        <div className="skeleton h-3 w-32" />
        <div className="skeleton mt-6 h-16 w-2/3 max-w-xl" />
        <div className="skeleton mt-10 aspect-[16/9] w-full" />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="shell py-32 text-center">
        <h1 className="t-h2">Modelo não encontrado</h1>
        <p className="mt-5 text-[0.9375rem] text-muted">
          Esse endereço não corresponde a nenhuma moto do catálogo.
        </p>
        <Link to="/motos" className="btn btn-primary mt-9">
          Ver o catálogo
        </Link>
      </div>
    );
  }

  const { bike, related } = query.data;
  const shots = [bike.image, ...bike.gallery].filter(Boolean);
  const specs = [
    { label: "Motor", value: bike.engine },
    { label: "Cilindrada", value: `${bike.displacement} cc` },
    { label: "Potência", value: `${bike.power} cv` },
    { label: "Torque", value: `${bike.torque} Nm` },
    { label: "Peso em ordem de marcha", value: `${bike.weight} kg` },
    { label: "Altura do assento", value: `${bike.seatHeight} mm` },
    { label: "Tanque", value: `${decimal(bike.fuel)} litros` },
    { label: "Consumo médio", value: `${decimal(bike.consumption)} km/l` },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="shell flex items-center gap-2 py-6 text-[0.75rem] text-muted">
        <Link to="/motos" className="ulink flex items-center gap-1.5">
          <ArrowLeft className="size-3.5" strokeWidth={2} />
          Catálogo
        </Link>
        <ChevronRight className="size-3.5" strokeWidth={2} />
        <span>{bike.family}</span>
        <ChevronRight className="size-3.5" strokeWidth={2} />
        <span className="text-ink">{bike.name}</span>
      </div>

      {/* Hero */}
      <section className="shell border-t border-line pt-10 pb-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div
              className="enter-fade relative aspect-[4/3] overflow-hidden bg-bone"
              style={{ "--delay": "60ms" } as React.CSSProperties}
            >
              <img
                key={shots[shotIndex]}
                src={shots[shotIndex]}
                alt={bike.name}
                className="multiply size-full object-cover"
              />
            </div>
            {shots.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {shots.map((shot, i) => (
                  <button
                    key={shot + i}
                    type="button"
                    aria-label={`Ver foto ${i + 1}`}
                    onClick={() => setShotIndex(i)}
                    className={`aspect-[4/3] overflow-hidden border transition-colors ${
                      i === shotIndex ? "border-orange" : "border-line"
                    }`}
                  >
                    <img
                      src={shot}
                      alt=""
                      loading="lazy"
                      className="multiply size-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-5">
            <div
              className="label enter flex items-center gap-3 text-muted"
              style={{ "--delay": "0ms" } as React.CSSProperties}
            >
              <span className="size-1.5 bg-orange" />
              {bike.family} · {bike.year}
            </div>

            <h1
              className="t-h2 enter mt-5"
              style={{ "--delay": "70ms" } as React.CSSProperties}
            >
              {bike.name}
            </h1>

            <p
              className="serif enter mt-5 text-[1.375rem] leading-snug text-muted"
              style={{ "--delay": "130ms" } as React.CSSProperties}
            >
              {bike.tagline}
            </p>

            <p
              className="enter mt-7 text-[0.9375rem] leading-relaxed text-muted"
              style={{ "--delay": "190ms" } as React.CSSProperties}
            >
              {bike.description}
            </p>

            <div
              className="enter mt-9 border-t border-line pt-7"
              style={{ "--delay": "240ms" } as React.CSSProperties}
            >
              <div className="label text-muted">Preço à vista</div>
              <div className="display tnum mt-2 text-[clamp(2rem,4vw,2.75rem)] leading-none">
                {money(bike.price)}
              </div>
              <p className="tnum mt-3 text-[0.8125rem] text-muted">
                ou 48x de <span className="font-semibold text-ink">{installment(bike.price)}</span>{" "}
                com 20% de entrada
              </p>
            </div>

            {/* Colors */}
            <div className="mt-8">
              <div className="label mb-4 text-muted">
                Cor · <span className="text-ink">{bike.colors[colorIndex]}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {bike.colors.map((color, i) => (
                  <button
                    key={color}
                    type="button"
                    className="chip"
                    data-active={i === colorIndex}
                    onClick={() => setColorIndex(i)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={addToCart.isPending}
                onClick={() =>
                  addToCart.mutate(
                    {
                      cartKey: getCartKey(),
                      kind: "moto",
                      productId: bike.id,
                      variant: bike.colors[colorIndex],
                      quantity: 1,
                    },
                    { onSuccess: () => setAdded(true) },
                  )
                }
                className="btn btn-primary flex-1"
              >
                {addToCart.isPending ? (
                  <>
                    <Loader2 className="spin size-4" strokeWidth={2} />
                    Adicionando
                  </>
                ) : added ? (
                  <>
                    <Check className="size-4" strokeWidth={2.4} />
                    No carrinho
                  </>
                ) : (
                  <>
                    <ShoppingBag className="size-4" strokeWidth={2} />
                    Adicionar ao carrinho
                  </>
                )}
              </button>
              <Link
                to={`/test-ride?moto=${bike.slug}`}
                className="btn btn-outline flex-1"
              >
                Agendar test ride
              </Link>
            </div>

            {added ? (
              <Link
                to="/carrinho"
                className="ulink label mt-4 inline-block text-orange"
              >
                Ir para o carrinho →
              </Link>
            ) : null}

            <div className="mt-9 grid gap-4 border-t border-line pt-7 sm:grid-cols-2">
              {[
                { icon: Truck, text: "Entrega em todo o Brasil, frete incluído" },
                { icon: ShieldCheck, text: "2 anos de garantia de fábrica" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <item.icon
                    className="mt-0.5 size-4 shrink-0 text-orange"
                    strokeWidth={1.8}
                  />
                  <span className="text-[0.8125rem] leading-relaxed text-muted">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="label mt-6 text-muted">
              Estoque:{" "}
              <span className={bike.stock > 0 ? "text-ink" : "text-orange"}>
                {bike.stock > 0
                  ? `${bike.stock} unidade${bike.stock > 1 ? "s" : ""} disponíveis`
                  : "sob consulta"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="border-y border-line bg-bone-2">
        <div className="shell py-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <div className="label text-muted">Ficha técnica</div>
                <h2 className="t-h2 mt-5">Números oficiais</h2>
                <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-muted">
                  Dados declarados pela fábrica para o ano-modelo {bike.year}. Podem
                  variar conforme configuração e acessórios instalados.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <dl className="grid gap-x-12 sm:grid-cols-2">
                {specs.map((spec, i) => (
                  <Reveal key={spec.label} delay={(i % 4) * 70}>
                    <div className="flex items-baseline justify-between gap-6 border-b border-line py-5">
                      <dt className="label text-muted">{spec.label}</dt>
                      <dd className="tnum text-right text-[0.9375rem] font-semibold">
                        {spec.value}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Financing */}
      <section className="shell py-20">
        <Reveal>
          <div className="label text-muted">Financiamento estimado</div>
          <h2 className="t-h2 mt-5 max-w-2xl">Escolha o prazo</h2>
        </Reveal>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[24, 36, 48].map((months, i) => (
            <Reveal key={months} delay={i * 90}>
              <div className="border-t border-line pt-6">
                <div className="label tnum text-muted">{months} meses</div>
                <div className="display tnum mt-3 text-[1.75rem] leading-none">
                  {installment(bike.price, months)}
                </div>
                <p className="tnum mt-3 text-[0.8125rem] text-muted">
                  Entrada de {moneyExact(bike.price * 0.2)} · taxa 1,29% a.m.
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 max-w-2xl text-[0.75rem] leading-relaxed text-muted">
          Simulação indicativa sujeita a análise de crédito. Valores finais definidos
          pela instituição financeira no momento da contratação.
        </p>
      </section>

      {/* Related */}
      {related.length ? (
        <section className="border-t border-line">
          <div className="shell py-20">
            <Reveal>
              <div className="label text-muted">Mesma família</div>
              <h2 className="t-h2 mt-5">Você também vai gostar</h2>
            </Reveal>
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((other, i) => (
                <Reveal key={other.id} delay={i * 90}>
                  <BikeCard bike={other} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Sticky buy bar */}
      <div className="sticky bottom-0 z-40 border-t border-line bg-bone/95 backdrop-blur-md">
        <div className="shell flex items-center justify-between gap-6 py-4">
          <div className="min-w-0">
            <div className="label truncate text-muted">
              {bike.name} · {bike.colors[colorIndex]}
            </div>
            <div className="display tnum mt-1 text-[1.25rem] leading-none">
              {money(bike.price)}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              to={`/test-ride?moto=${bike.slug}`}
              className="btn btn-outline hidden sm:inline-flex"
            >
              Test ride
            </Link>
            <button
              type="button"
              disabled={addToCart.isPending}
              onClick={() =>
                addToCart.mutate(
                  {
                    cartKey: getCartKey(),
                    kind: "moto",
                    productId: bike.id,
                    variant: bike.colors[colorIndex],
                    quantity: 1,
                  },
                  { onSuccess: () => setAdded(true) },
                )
              }
              className="btn btn-primary"
            >
              {addToCart.isPending ? (
                <Loader2 className="spin size-4" strokeWidth={2} />
              ) : (
                <ShoppingBag className="size-4" strokeWidth={2} />
              )}
              Comprar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
