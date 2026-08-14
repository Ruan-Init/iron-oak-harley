import type { RouterClient } from "@orpc/server";
import { createApp } from "./__core/app";
import { ping } from "./routes/ping";
import { auth } from "./auth";
import { catalog } from "./routes/catalog";
import { cart, checkout } from "./routes/cart";
import { engagement } from "./routes/engagement";

export const router = {
  ping,
  ...catalog,
  cart,
  checkout,
  ...engagement,
};

export type AppRouter = typeof router;
/** Typed client for the router — used by the web and mobile api clients. */
export type AppRouterClient = RouterClient<AppRouter>;

const app = createApp(router);
app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));

export default app;
