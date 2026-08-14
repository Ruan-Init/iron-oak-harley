import { useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useMyOrders(enabled: boolean) {
  return useQuery(orpc.account.orders.queryOptions({ enabled }));
}

export function useMyTestRides(enabled: boolean) {
  return useQuery(orpc.account.testRides.queryOptions({ enabled }));
}
