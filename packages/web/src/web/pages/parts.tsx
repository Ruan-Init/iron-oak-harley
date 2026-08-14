import { useState } from "react";
import { PageHero } from "../components/layout";
import { Reveal } from "../components/reveal";
import { PartCard, PartCardSkeleton } from "../components/part-card";
import { useParts, usePartCategories } from "../queries/parts";

export default function PartsPage() {
  const [category, setCategory] = useState("Todos");
  const categories = usePartCategories();
  const parts = useParts(category);

  return (
    <>
      <PageHero
        eyebrow="Peças & acessórios"
        title={
          <>
            Couro, aço
            <br />
            e proteção
          </>
        }
        intro="Catálogo curado de equipamento de pilotagem e componentes originais. Envio em até 48h para todo o Brasil, frete fixo de R$ 49."
      >
        <div className="flex flex-wrap gap-2">
          {["Todos", ...(categories.data ?? [])].map((item) => (
            <button
              key={item}
              type="button"
              className="chip"
              data-active={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </PageHero>

      <section className="shell py-16">
        <div className="label border-b border-line pb-5 text-muted">
          {parts.isLoading ? (
            "Carregando…"
          ) : (
            <>
              <span className="tnum text-ink">{parts.data?.length ?? 0}</span> itens
              {category !== "Todos" ? ` em ${category}` : ""}
            </>
          )}
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {parts.isLoading
            ? Array.from({ length: 8 }).map((_, i) => <PartCardSkeleton key={i} />)
            : parts.data?.map((part, i) => (
                <Reveal key={part.id} delay={(i % 4) * 80}>
                  <PartCard part={part} />
                </Reveal>
              ))}
        </div>

        {!parts.isLoading && !parts.data?.length ? (
          <div className="py-24 text-center">
            <h2 className="t-h3">Nada nessa categoria</h2>
            <button
              type="button"
              onClick={() => setCategory("Todos")}
              className="btn btn-outline mt-8"
            >
              Ver tudo
            </button>
          </div>
        ) : null}
      </section>

      <section className="border-t border-line bg-bone-2">
        <div className="shell grid gap-10 py-16 md:grid-cols-3">
          {[
            {
              title: "Frete fixo",
              copy: "R$ 49 para qualquer acessório em todo o país. Grátis quando o pedido inclui uma moto.",
            },
            {
              title: "Instalação na loja",
              copy: "Componentes comprados aqui são instalados sem custo de mão de obra nas cinco unidades.",
            },
            {
              title: "Troca em 30 dias",
              copy: "Tamanho errado de capacete, jaqueta ou bota? Trocamos sem burocracia dentro de 30 dias.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <div className="border-t border-line pt-6">
                <h3 className="t-h3 text-[1.125rem]">{item.title}</h3>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-muted">
                  {item.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
