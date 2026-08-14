import { useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function usePosts(limit?: number) {
  return useQuery(
    orpc.blog.list.queryOptions({ input: { limit }, staleTime: 5 * 60_000 }),
  );
}

export function usePost(slug: string) {
  return useQuery(
    orpc.blog.get.queryOptions({
      input: { slug },
      enabled: Boolean(slug),
      staleTime: 5 * 60_000,
    }),
  );
}
