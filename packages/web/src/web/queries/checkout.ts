import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";
import { cartQueryKey } from "./cart";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation(
    orpc.checkout.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: cartQueryKey() });
        queryClient.invalidateQueries({ queryKey: orpc.account.orders.key() });
      },
    }),
  );
}

export function useOrder(code: string) {
  return useQuery(
    orpc.checkout.get.queryOptions({
      input: { code },
      enabled: Boolean(code),
    }),
  );
}
