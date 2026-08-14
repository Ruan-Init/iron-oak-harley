import { useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useDealers() {
  return useQuery(orpc.dealers.list.queryOptions({ staleTime: 5 * 60_000 }));
}
