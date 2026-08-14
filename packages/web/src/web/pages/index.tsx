import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, Calendar, ShieldCheck, Wrench } from "lucide-react";
import { Reveal } from "../components/reveal";
import { SectionHead, Stat } from "../components/section";
import { BikeCard, BikeCardSkeleton } from "../components/bike-card";
import { PartCard, PartCardSkeleton } from "../components/part-card";
import {
  useComparison,
  useFeaturedMotorcycles,
} from "../queries/motorcycles";
import { useParts } from "../queries/parts";
import { usePosts } from "../queries/blog";
import { decimal, installment, money, shortDate } from "../lib/format";

const MARQUEE = [
  "Sportster S",
  "Nightster",
  "Low Rider S",
  "Fat Boy",
  "Breakout",
  "Heritage Classic",
  "Street Glide",
  "Road Glide",
  "CVO",
  "Pan America",
];

const PILLARS = [
  {
    icon: Wrench,
    title: "Oficina certificada",
    copy: "Mecânicos formados pela Harley-Davidson University, ferramentas originais e diagnóstico eletrônico completo.",
  },
  {
    icon: ShieldCheck,
    title: "Garantia estendida",
    copy: "Dois anos sem limite de quilometragem em toda a linha zero, com assistência 24h em todo o território nacional.",
  },
  {
    icon: Calendar,
    title: "Test ride sem custo",
    copy: "Agende 40 minutos com o modelo escolhido. Rota urbana ou serra, com instrutor acompanhando quando quiser.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Entrei para olhar uma Nightster e saí com test ride marcado no mesmo dia. Nunca vi uma loja tratar papelada com tanta clareza.",
    name: "Marina Bueno",
    role: "Sócia-fundadora, Estúdio Ferro",
    city: "São Paulo, SP",
  },
  {
    quote:
      "A revisão da minha Road Glide foi feita em quatro horas, com relatório fotográfico item por item. Virou meu ponto fixo.",
    name: "Otávio Rezende",
    role: "Piloto amador e engenheiro",
    city: "Belo Horizonte, MG",
  },
  {
    quote:
      "Comprei minha primeira Harley aos 52 anos. Explicaram cada detalhe sem pressa e sem aquele empurrão de vendedor.",
    name: "Cláudia Marques",
    role: "Arquiteta",
    city: "Curitiba, PR",
  },
];

export default function IndexPage() {
  const featured = useFeaturedMotorcycles();
  const comparison = useComparison();
  const parts = useParts(undefined, 4);
  const posts = usePosts(3);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="shell relative pt-14 pb-0 md:pt-20">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div
                className="label enter flex items-center gap-3 text-muted"
                style={{ "--delay": "0ms" } as React.CSSProperties}
              >
                <span className="size-1.5 bg-orange" />
                Linha 2026 · Estoque nacional
              </div>

              <h1 className="t-hero enter mt-6" style={{ "--delay": "80ms" } as React.CSSProperties}>
                Ferro,
                <br />
                fogo e<br />
                <span className="text-orange">estrada.</span>
              </h1>

              <p
                className="enter mt-8 max-w-md text-[1.0625rem] leading-relaxed text-muted"
                style={{ "--delay": "180ms" } as React.CSSProperties}
              >
                Concessionária independente Harley-Davidson desde 1998. Motos zero e
                selecionadas, oficina certificada e uma comunidade que roda junto todo
                fim de semana.
              </p>

              <div
                className="enter mt-10 flex flex-wrap items-center gap-3 pb-14"
                style={{ "--delay": "260ms" } as React.CSSProperties}
              >
                <Link to="/motos" className="btn btn-primary">
                  Ver o catálogo
                  <ArrowRight className="size-4" strokeWidth={2} />
                </Link>
                <Link to="/test-ride" className="btn btn-outline">
                  Agendar test ride
                </Link>
              </div>
            </div>

            <div className="relative lg:col-span-5">
              <div
                className="enter-fade relative"
                style={{ "--delay": "280ms" } as React.CSSProperties}
              >
                <img
                  src="/images/hero-bike.png"
                  alt="Harley-Davidson em destaque"
                  className="w-full object-contain drop-shadow-[0_30px_50px_rgba(18,17,16,0.14)]"
                />
              </div>
              <div
                className="enter absolute -top-2 right-0 hidden text-right md:block"
                style={{ "--delay": "420ms" } as React.CSSProperties}
              >
                <div className="label text-muted">A partir de</div>
                <div className="display tnum mt-1 text-[2rem] leading-none">
                  {featured.data?.[0] ? money(featured.data[0].price) : "R$ 69.900"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* stats strip */}
        <div className="shell border-t border-line">
          <div className="grid grid-cols-2 gap-8 py-9 md:grid-cols-4">
            {[
              { value: "27", unit: "anos", label: "De casa aberta" },
              { value: "5", unit: "lojas", label: "Concessionárias parceiras" },
              { value: "4.812", unit: "", label: "Motos entregues" },
              { value: "98", unit: "%", label: "Clientes recomendam" },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80}>
                <Stat {...stat} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- MARQUEE ---------------- */}
      <div className="overflow-hidden border-b border-line bg-bone-2 py-4">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="label flex items-center gap-6 px-6 text-muted whitespace-nowrap"
            >
              {name}
              <span className="size-1 rounded-full bg-orange" />
            </span>
          ))}
        </div>
      </div>

      {/* ---------------- FEATURED MODELS ---------------- */}
      <section className="shell py-20 md:py-28">
        <Reveal>
          <SectionHead
            index="01"
            eyebrow="Seleção da casa"
            title={
              <>
                Quatro motos que
                <br />
                definem a linha
              </>
            }
            intro="Escolhemos os modelos que melhor traduzem cada família: a agressividade da Sport, o peso da Cruiser, o conforto da Touring e a coragem da Adventure."
            action={
              <Link to="/motos" className="btn btn-outline">
                Todos os modelos
                <ArrowUpRight className="size-4" strokeWidth={2} />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {featured.isLoading
            ? Array.from({ length: 4 }).map((_, i) => <BikeCardSkeleton key={i} />)
            : featured.data?.map((bike, i) => (
                <Reveal key={bike.id} delay={i * 90}>
                  <BikeCard bike={bike} index={i} />
                </Reveal>
              ))}
        </div>
      </section>

      {/* ---------------- DARK MANIFESTO ---------------- */}
      <section className="bg-ink text-bone">
        <div className="shell py-20 md:py-28">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHead
                  light
                  index="02"
                  eyebrow="Engenharia"
                  title={
                    <>
                      Big Twin,
                      <br />
                      sem atalho
                    </>
                  }
                  intro="Motores Milwaukee-Eight e Revolution Max recebem calibração de fábrica e revisão de entrega em nossa própria bancada antes de sair da loja."
                />
              </Reveal>

              <div className="mt-12 grid grid-cols-2 gap-8">
                {[
                  { value: "121", unit: "Nm", label: "Torque médio da linha" },
                  { value: "1.923", unit: "cc", label: "Maior cilindrada" },
                  { value: "48", unit: "meses", label: "Financiamento próprio" },
                  { value: "24", unit: "h", label: "Assistência nacional" },
                ].map((stat, i) => (
                  <Reveal key={stat.label} delay={i * 80}>
                    <Stat {...stat} light />
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={120}>
                <div className="zoomable relative aspect-[16/10] overflow-hidden">
                  <img
                    src="/images/lifestyle-night.jpg"
                    alt="Harley-Davidson à noite"
                    loading="lazy"
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <p className="serif absolute bottom-6 left-6 max-w-md text-[1.25rem] leading-snug text-bone md:text-[1.5rem]">
                    “Uma Harley não é sobre chegar antes. É sobre chegar do jeito
                    certo.”
                  </p>
                </div>
              </Reveal>

              <div className="mt-10 grid gap-8 sm:grid-cols-3">
                {PILLARS.map((pillar, i) => (
                  <Reveal key={pillar.title} delay={i * 90}>
                    <div className="hairline-dark pt-5">
                      <pillar.icon
                        className="size-5 text-orange"
                        strokeWidth={1.6}
                      />
                      <h3 className="mt-4 text-[0.9375rem] tracking-normal normal-case">
                        {pillar.title}
                      </h3>
                      <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-bone/60">
                        {pillar.copy}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- COMPARISON TABLE ---------------- */}
      <section className="shell py-20 md:py-28">
        <Reveal>
          <SectionHead
            index="03"
            eyebrow="Comparativo"
            title="Números lado a lado"
            intro="Especificações declaradas pela fábrica para os quatro modelos em destaque."
          />
        </Reveal>

        <Reveal delay={100} className="mt-12 -mx-4 overflow-x-auto px-4">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-y border-line">
                <th className="label py-5 pr-6 text-muted">Modelo</th>
                {comparison.data?.map((bike) => (
                  <th key={bike.id} className="py-5 pr-6 align-bottom">
                    <Link
                      to={`/motos/${bike.slug}`}
                      className="t-h3 ulink block text-[1.0625rem]"
                    >
                      {bike.name}
                    </Link>
                    <span className="label mt-2 block text-muted">
                      {bike.family}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["Motor", (b: NonNullable<typeof comparison.data>[number]) => b.engine],
                  [
                    "Cilindrada",
                    (b: NonNullable<typeof comparison.data>[number]) =>
                      `${b.displacement} cc`,
                  ],
                  [
                    "Potência",
                    (b: NonNullable<typeof comparison.data>[number]) => `${b.power} cv`,
                  ],
                  [
                    "Torque",
                    (b: NonNullable<typeof comparison.data>[number]) => `${b.torque} Nm`,
                  ],
                  [
                    "Peso",
                    (b: NonNullable<typeof comparison.data>[number]) => `${b.weight} kg`,
                  ],
                  [
                    "Altura do assento",
                    (b: NonNullable<typeof comparison.data>[number]) =>
                      `${b.seatHeight} mm`,
                  ],
                  [
                    "Consumo",
                    (b: NonNullable<typeof comparison.data>[number]) =>
                      `${decimal(b.consumption)} km/l`,
                  ],
                  [
                    "Preço",
                    (b: NonNullable<typeof comparison.data>[number]) => money(b.price),
                  ],
                ] as const
              ).map(([label, render]) => (
                <tr key={label} className="border-b border-line">
                  <td className="label py-4 pr-6 text-muted">{label}</td>
                  {comparison.isLoading ? (
                    <td colSpan={4} className="py-4" aria-label="Carregando">
                      <div className="skeleton h-4 w-full" />
                    </td>
                  ) : (
                    comparison.data?.map((bike) => (
                      <td
                        key={bike.id}
                        className={`tnum py-4 pr-6 text-[0.875rem] ${
                          label === "Preço" ? "font-semibold text-orange" : ""
                        }`}
                      >
                        {render(bike)}
                      </td>
                    ))
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      {/* ---------------- ACCESSORIES ---------------- */}
      <section className="border-y border-line bg-bone-2">
        <div className="shell py-20 md:py-28">
          <Reveal>
            <SectionHead
              index="04"
              eyebrow="Peças & acessórios"
              title="Equipamento que aguenta"
              intro="Capacetes homologados, couro selecionado e componentes originais Screamin' Eagle com estoque imediato."
              action={
                <Link to="/acessorios" className="btn btn-outline">
                  Ver a loja
                  <ArrowUpRight className="size-4" strokeWidth={2} />
                </Link>
              }
            />
          </Reveal>

          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {parts.isLoading
              ? Array.from({ length: 4 }).map((_, i) => <PartCardSkeleton key={i} />)
              : parts.data?.map((part, i) => (
                  <Reveal key={part.id} delay={i * 80}>
                    <PartCard part={part} />
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="shell py-20 md:py-28">
        <Reveal>
          <SectionHead
            index="05"
            eyebrow="Quem roda com a gente"
            title="Palavra de dono"
          />
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {TESTIMONIALS.map((item, i) => (
            <Reveal key={item.name} delay={i * 100}>
              <figure className="flex h-full flex-col border-t border-line pt-6">
                <blockquote className="serif text-[1.25rem] leading-snug">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-auto pt-8">
                  <div className="text-[0.9375rem] font-semibold">{item.name}</div>
                  <div className="mt-1 text-[0.8125rem] text-muted">{item.role}</div>
                  <div className="label mt-2 text-orange">{item.city}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- BLOG ---------------- */}
      <section className="border-t border-line">
        <div className="shell py-20 md:py-28">
          <Reveal>
            <SectionHead
              index="06"
              eyebrow="Diário Iron & Oak"
              title="Notícias e estradas"
              action={
                <Link to="/blog" className="btn btn-outline">
                  Todos os textos
                  <ArrowUpRight className="size-4" strokeWidth={2} />
                </Link>
              }
            />
          </Reveal>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {posts.isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border-t border-line pt-6">
                    <div className="skeleton aspect-[3/2] w-full" />
                    <div className="skeleton mt-5 h-5 w-2/3" />
                  </div>
                ))
              : posts.data?.map((post, i) => (
                  <Reveal key={post.id} delay={i * 100}>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="zoomable group block border-t border-line pt-6"
                    >
                      <div className="aspect-[3/2] overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          loading="lazy"
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="label mt-5 flex items-center gap-3 text-muted">
                        <span className="text-orange">{post.category}</span>
                        <span className="h-px w-4 bg-current opacity-40" />
                        {shortDate(post.publishedAt)}
                      </div>
                      <h3 className="t-h3 mt-3 text-[1.25rem] transition-colors group-hover:text-orange">
                        {post.title}
                      </h3>
                      <p className="mt-3 line-clamp-2 text-[0.875rem] leading-relaxed text-muted">
                        {post.excerpt}
                      </p>
                    </Link>
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="relative overflow-hidden bg-graphite text-bone">
        <img
          src="/images/lifestyle-desert.jpg"
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 size-full object-cover opacity-30"
        />
        <div className="relative shell py-24 text-center md:py-32">
          <Reveal>
            <div className="label text-bone/50">Test ride gratuito</div>
            <h2 className="t-h2 mx-auto mt-6 max-w-3xl">
              Quarenta minutos bastam
              <br />
              para você entender
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-[0.9375rem] leading-relaxed text-bone/70">
              Escolha o modelo, a concessionária e o horário. A gente prepara a moto,
              o capacete e a rota.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link to="/test-ride" className="btn btn-primary">
                Agendar agora
                <ArrowRight className="size-4" strokeWidth={2} />
              </Link>
              <Link to="/contato" className="btn btn-outline-light">
                Falar com a loja
              </Link>
            </div>
            <p className="tnum mt-8 text-[0.75rem] text-bone/45">
              Simulação: 48x de {installment(9990000)} para uma moto de{" "}
              {money(9990000)} com 20% de entrada.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
