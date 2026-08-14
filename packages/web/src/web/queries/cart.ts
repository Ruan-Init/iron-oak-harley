import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";
import { getCartKey } from "../lib/cart-key";

function cartInput() {
  return { cartKey: getCartKey() };
}

export function cartQueryKey() {
  return orpc.cart.get.queryOptions({ input: cartInput() }).queryKey;
}

export function useCart() {
  return useQuery(
    orpc.cart.get.queryOptions({ input: cartInput(), staleTime: 10_000 }),
  );
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation(
    orpc.cart.add.mutationOptions({
      onSuccess: (data) => queryClient.setQueryData(cartQueryKey(), data),
    }),
  );
}

export function useSetQuantity() {
  const queryClient = useQueryClient();
  return useMutation(
    orpc.cart.setQuantity.mutationOptions({
      onSuccess: (data) => queryClient.setQueryData(cartQueryKey(), data),
    }),
  );
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation(
    orpc.cart.remove.mutationOptions({
      onSuccess: (data) => queryClient.setQueryData(cartQueryKey(), data),
    }),
  );
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation(
    orpc.cart.clear.mutationOptions({
      onSuccess: (data) => queryClient.setQueryData(cartQueryKey(), data),
    }),
  );
}

export { getCartKey };
