import type { ReactNode } from "react";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";
import { authClient } from "../lib/auth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="shell flex min-h-[60vh] items-center justify-center py-24">
        <div className="flex items-center gap-3 text-muted">
          <Loader2 className="spin size-4" />
          <span className="label">Verificando sessão</span>
        </div>
      </div>
    );
  }

  if (!session) return <Redirect to="/entrar" />;

  return <>{children}</>;
}
