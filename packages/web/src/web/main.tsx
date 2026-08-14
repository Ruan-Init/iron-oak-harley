// Entry point referenced by index.html — composition only, real bootstrap
// lives in __main.tsx (template-managed).
import { authClient } from "./lib/auth";
import "./__main";

// Finish a returning managed sign-in redirect; the session refreshes reactively.
void authClient.managedAuth.handleRedirect().catch(() => undefined);
