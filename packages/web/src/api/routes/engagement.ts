import { z } from "zod";
import { desc, eq, inArray } from "drizzle-orm";
import { base } from "../__core/app";
import { authed } from "../middleware/auth";
import { db } from "../database";
import * as schema from "../database/schema";
import { auth } from "../auth";

export const testRides = {
  create: base
    .input(
      z.object({
        name: z.string().min(3),
        email: z.string().email(),
        phone: z.string().min(8),
        motorcycleId: z.number(),
        dealerId: z.number(),
        date: z.string().min(8),
        time: z.string().min(4),
        license: z.string().min(2),
        notes: z.string().optional(),
      }),
    )
    .handler(async ({ input, context }) => {
      const session = await auth.api.getSession({ headers: context.headers });
      const [ride] = await db
        .insert(schema.testRides)
        .values({ ...input, userId: session?.user.id ?? null })
        .returning();
      return ride;
    }),
};

export const contact = {
  create: base
    .input(
      z.object({
        name: z.string().min(3),
        email: z.string().email(),
        phone: z.string().min(8),
        subject: z.string().min(2),
        message: z.string().min(10),
      }),
    )
    .handler(async ({ input }) => {
      const [lead] = await db.insert(schema.leads).values(input).returning();
      return { id: lead.id };
    }),
};

export const account = {
  me: authed.handler(({ context }) => context.user),

  orders: authed.handler(async ({ context }) => {
    const rows = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.userId, context.user.id))
      .orderBy(desc(schema.orders.createdAt));
    if (!rows.length) return [];
    const items = await db
      .select()
      .from(schema.orderItems)
      .where(
        inArray(
          schema.orderItems.orderId,
          rows.map((r) => r.id),
        ),
      );
    return rows.map((order) => ({
      ...order,
      items: items.filter((i) => i.orderId === order.id),
    }));
  }),

  testRides: authed.handler(async ({ context }) => {
    const rows = await db
      .select()
      .from(schema.testRides)
      .where(eq(schema.testRides.userId, context.user.id))
      .orderBy(desc(schema.testRides.createdAt));
    if (!rows.length) return [];
    const bikes = await db
      .select()
      .from(schema.motorcycles)
      .where(
        inArray(
          schema.motorcycles.id,
          rows.map((r) => r.motorcycleId),
        ),
      );
    const dealerRows = await db.select().from(schema.dealers);
    return rows.map((ride) => ({
      ...ride,
      motorcycle: bikes.find((b) => b.id === ride.motorcycleId)?.name ?? "—",
      dealer: dealerRows.find((d) => d.id === ride.dealerId)?.name ?? "—",
    }));
  }),
};

/** Feature router: lead capture and signed-in account surface. */
export const engagement = { testRides, contact, account };
