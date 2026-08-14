import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PageHero } from "../components/layout";
import { Reveal } from "../components/reveal";
import { BikeCard, BikeCardSkeleton } from "../components/bike-card";
import {
  useFacets,
  useMotorcycles,
  type MotorcycleFilters,
} from "../queries/motorcycles";
import { money } from "../lib/format";

const SORTS: { value: MotorcycleFilters["sort"]; label: string }[] = [
  { value: "destaque", label: "Destaques" },
  { value: "preco-asc", label: "Menor preço" },
  { value: "preco-desc", label: "Maior preço" },
  { value: "potencia", label: "Mais potente" },
  { value: "novidade", label: "Lançamentos" },
];

const DISPLACEMENTS = [
  { value: 0, label: "Todas" },
  { value: 900, label: "900 cc +" },
  { value: 1200, label: "1.200 cc +" },
  { value: 1800, label: "1.800 cc +" },
];

export default function MotorcyclesPage() {
  const facets = useFacets();
  const [families, setFamilies] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [minDisplacement, setMinDisplacement] = useState(0);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sort, setSort] = useState<MotorcycleFilters["sort"]>("destaque");
  const [search, setSearch] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);

  const filters = useMemo<MotorcycleFilters>(
    () => ({
      families: families.length ? families : undefined,
      years: years.length ? years : undefined,
      minDisplacement: minDisplacement || undefined,
      maxPrice: maxPrice ?? undefined,
      search: search.trim() || undefined,
      sort,
    }),
    [families, years, minDisplacement, maxPrice, search, sort],
  );

  const bikes = useMotorcycles(filters);
  const activeCount =
    families.length + years.length + (minDisplacement ? 1 : 0) + (maxPrice ? 1 : 0);

  function toggle<T>(list: T[], value: T, setter: (next: T[]) => void) {
    setter(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );
  }

  function clearAll() {
    setFamilies([]);
    setYears([]);
    setMinDisplacement(0);
    setMaxPrice(null);
    setSearch("");
  }

  const priceSteps = facets.data
    ? [
        { value: null, label: "Qualquer" },
        { value: 80000_00, label: "até R$ 80 mil" },
        { value: 120000_00, label: "até R$ 120 mil" },
        { value: facets.data.maxPrice, label: "até " + money(facets.data.maxPrice) },
      ]
    : [];

  const filterPanel = (
    <div className="space-y-9">
      <div>
        <div className="label mb-4 text-muted">Família</div>
        <div className="flex flex-wrap gap-2">
          {facets.data?.families.map((family) => (
            <button
              key={family}
              type="button"
              className="chip"
              data-active={families.includes(family)}
              onClick={() => toggle(families, family, setFamilies)}
            >
              {family}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="label mb-4 text-muted">Cilindrada mínima</div>
        <div className="flex flex-wrap gap-2">
          {DISPLACEMENTS.map((item) => (
            <button
              key={item.value}
              type="button"
              className="chip"
              data-active={minDisplacement === item.value}
              onClick={() => setMinDisplacement(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="label mb-4 text-muted">Preço</div>
        <div className="flex flex-wrap gap-2">
          {priceSteps.map((item) => (
            <button
              key={String(item.value)}
              type="button"
              className="chip"
              data-active={maxPrice === item.value}
              onClick={() => setMaxPrice(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="label mb-4 text-muted">Ano-modelo</div>
        <div className="flex flex-wrap gap-2">
          {facets.data?.years.map((year) => (
            <button
              key={year}
              type="button"
              className="chip tnum"
              data-active={years.includes(year)}
              onClick={() => toggle(years, year, setYears)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {activeCount > 0 ? (
        <button
          type="button"
          onClick={clearAll}
          className="label flex items-center gap-2 text-orange"
        >
          <X className="size-3.5" strokeWidth={2.4} />
          Limpar filtros ({activeCount})
        </button>
      ) : null}
    </div>
  );

  return (
    <>
      <PageHero
        eyebrow="Catálogo 2026"
        title={
          <>
            Toda a linha,
            <br />
            do Sportster ao CVO
          </>
        }
        intro="Dez modelos em estoque nacional, todos com revisão de entrega feita na nossa oficina e documentação incluída."
      >
        <div className="flex items-center gap-3 border-b border-line pb-1 md:max-w-sm">
          <Search className="size-4 text-muted" strokeWidth={1.8} />
          <input
            aria-label="Buscar por modelo"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por modelo"
            className="field border-0 py-2"
          />
        </div>
      </PageHero>

      <div className="shell grid gap-12 py-14 lg:grid-cols-[240px_1fr] lg:gap-16">
        {/* Sidebar filters — desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-[96px]">
            <div className="label mb-8 flex items-center gap-2">
              <SlidersHorizontal className="size-3.5" strokeWidth={2} />
              Filtros
            </div>
            {filterPanel}
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <div className="label text-muted">
              {bikes.isLoading ? (
                "Carregando…"
              ) : (
                <>
                  <span className="tnum text-ink">{bikes.data?.length ?? 0}</span>{" "}
                  {bikes.data?.length === 1 ? "modelo" : "modelos"}
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setPanelOpen(true)}
                className="label flex items-center gap-2 lg:hidden"
              >
                <SlidersHorizontal className="size-3.5" strokeWidth={2} />
                Filtros
                {activeCount ? (
                  <span className="tnum text-orange">({activeCount})</span>
                ) : null}
              </button>

              <label className="flex items-center gap-3">
                <span className="label hidden text-muted sm:inline">Ordenar</span>
                <select
                  aria-label="Ordenar"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as MotorcycleFilters["sort"])}
                  className="field label w-auto py-1"
                >
                  {SORTS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {bikes.isLoading ? (
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <BikeCardSkeleton key={i} />
              ))}
            </div>
          ) : bikes.data?.length ? (
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
              {bikes.data.map((bike, i) => (
                <Reveal key={bike.id} delay={(i % 6) * 70}>
                  <BikeCard bike={bike} index={i} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <h2 className="t-h3">Nenhum modelo encontrado</h2>
              <p className="mt-4 text-[0.9375rem] text-muted">
                Ajuste os filtros ou limpe a busca para ver o catálogo completo.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="btn btn-outline mt-8"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      {panelOpen ? (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
          <button
            type="button"
            aria-label="Fechar"
            className="flex-1 bg-ink/40"
            onClick={() => setPanelOpen(false)}
          />
          <div className="w-[86vw] max-w-sm overflow-y-auto bg-bone p-7">
            <div className="mb-8 flex items-center justify-between">
              <span className="label">Filtros</span>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                aria-label="Fechar filtros"
              >
                <X className="size-5" strokeWidth={1.8} />
              </button>
            </div>
            {filterPanel}
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="btn btn-ink mt-10 w-full"
            >
              Ver {bikes.data?.length ?? 0} modelos
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
