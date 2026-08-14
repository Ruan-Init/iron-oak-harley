import { useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useParts(category?: string, limit?: number) {
  return useQuery(
    orpc.parts.list.queryOptions({
      input: { category, limit },
      staleTime: 60_000,
    }),
  );
}

export function usePartCategories() {
  return useQuery(orpc.parts.categories.queryOptions({ staleTime: 5 * 60_000 }));
}
