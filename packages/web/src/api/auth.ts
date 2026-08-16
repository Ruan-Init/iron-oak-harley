import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { runableManagedAuth } from "@runablehq/managed-auth/server";
import { db } from "./database";

const runableApplicationId = process.env.APPLICATION_ID;
const runableIssuer = process.env.VITE_RUNABLE_AUTH_ISSUER;
const runablePlugins = runableApplicationId && runableIssuer
  ? runableManagedAuth({
      applicationId: runableApplicationId,
      issuer: runableIssuer,
    })
  : [];

export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL: process.env.WEBSITE_URL ?? "http://localhost:4200",
  database: drizzleAdapter(db, { provider: "sqlite" }),
  emailAndPassword: { enabled: true },
  secret: process.env.BETTER_AUTH_SECRET ?? "dev-secret",
  trustedOrigins: (request) => {
    const origin = request?.headers.get("origin");
    return origin ? [origin] : ["*"];
  },
  plugins: runablePlugins,
});
