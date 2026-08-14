import { useMutation } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useSendContact() {
  return useMutation(orpc.contact.create.mutationOptions());
}
