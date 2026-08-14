import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useCreateTestRide() {
  const queryClient = useQueryClient();
  return useMutation(
    orpc.testRides.create.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: orpc.account.testRides.key() }),
    }),
  );
}
