import { useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export type MotorcycleFilters = {
  families?: string[];
  minPrice?: number;
  maxPrice?: number;
  minDisplacement?: number;
  years?: number[];
  sort: "destaque" | "preco-asc" | "preco-desc" | "potencia" | "novidade";
  search?: string;
};

export function useMotorcycles(filters: MotorcycleFilters) {
  return useQuery(
    orpc.motorcycles.list.queryOptions({ input: filters, staleTime: 30_000 }),
  );
}

export function useFeaturedMotorcycles() {
  return useQuery(
    orpc.motorcycles.featured.queryOptions({ staleTime: 5 * 60_000 }),
  );
}

export function useFacets() {
  return useQuery(orpc.motorcycles.facets.queryOptions({ staleTime: 5 * 60_000 }));
}

export function useMotorcycle(slug: string) {
  return useQuery(
    orpc.motorcycles.get.queryOptions({
      input: { slug },
      enabled: Boolean(slug),
      staleTime: 60_000,
    }),
  );
}

export function useComparison() {
  return useQuery(orpc.motorcycles.compare.queryOptions({ staleTime: 5 * 60_000 }));
}
