import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";

export type CartLine = {
  id: number;
  kind: "moto" | "peca";
  productId: number;
  slug: string;
  name: string;
  image: string;
  variant: string | null;
  unitPrice: number;
  quantity: number;
  total: number;
};

export async function buildCart(cartKey: string) {
  const rows = await db
    .select()
    .from(schema.cartItems)
    .where(eq(schema.cartItems.cartKey, cartKey))
    .orderBy(schema.cartItems.createdAt);

  const bikeIds = rows.filter((r) => r.kind === "moto").map((r) => r.productId);
  const partIds = rows.filter((r) => r.kind === "peca").map((r) => r.productId);

  const bikes = bikeIds.length
    ? await db
        .select()
        .from(schema.motorcycles)
        .where(inArray(schema.motorcycles.id, bikeIds))
    : [];
  const partRows = partIds.length
    ? await db.select().from(schema.parts).where(inArray(schema.parts.id, partIds))
    : [];

  const lines: CartLine[] = [];
  for (const row of rows) {
    if (row.kind === "moto") {
      const bike = bikes.find((b) => b.id === row.productId);
      if (!bike) continue;
      lines.push({
        id: row.id,
        kind: "moto",
        productId: bike.id,
        slug: bike.slug,
        name: `${bike.name} ${bike.year}`,
        image: bike.image,
        variant: row.variant,
        unitPrice: bike.price,
        quantity: row.quantity,
        total: bike.price * row.quantity,
      });
    } else {
      const part = partRows.find((p) => p.id === row.productId);
      if (!part) continue;
      lines.push({
        id: row.id,
        kind: "peca",
        productId: part.id,
        slug: part.slug,
        name: part.name,
        image: part.image,
        variant: row.variant,
        unitPrice: part.price,
        quantity: row.quantity,
        total: part.price * row.quantity,
      });
    }
  }

  const subtotal = lines.reduce((sum, l) => sum + l.total, 0);
  const shipping = lines.some((l) => l.kind === "moto") || subtotal === 0 ? 0 : 4900;
  return {
    lines,
    subtotal,
    shipping,
    total: subtotal + shipping,
    count: lines.reduce((sum, l) => sum + l.quantity, 0),
  };
}

const keyInput = z.object({ cartKey: z.string().min(6) });

export const cart = {
  get: base.input(keyInput).handler(({ input }) => buildCart(input.cartKey)),

  add: base
    .input(
      keyInput.extend({
        kind: z.enum(["moto", "peca"]),
        productId: z.number(),
        variant: z.string().nullish(),
        quantity: z.number().min(1).max(10).default(1),
      }),
    )
    .handler(async ({ input }) => {
      const [existing] = await db
        .select()
        .from(schema.cartItems)
        .where(
          and(
            eq(schema.cartItems.cartKey, input.cartKey),
            eq(schema.cartItems.kind, input.kind),
            eq(schema.cartItems.productId, input.productId),
          ),
        );

      if (existing) {
        await db
          .update(schema.cartItems)
          .set({
            quantity: Math.min(existing.quantity + input.quantity, 10),
            variant: input.variant ?? existing.variant,
          })
          .where(eq(schema.cartItems.id, existing.id));
      } else {
        await db.insert(schema.cartItems).values({
          cartKey: input.cartKey,
          kind: input.kind,
          productId: input.productId,
          quantity: input.quantity,
          variant: input.variant ?? null,
        });
      }
      return buildCart(input.cartKey);
    }),

  setQuantity: base
    .input(keyInput.extend({ id: z.number(), quantity: z.number().min(0).max(10) }))
    .handler(async ({ input }) => {
      if (input.quantity === 0) {
        await db.delete(schema.cartItems).where(eq(schema.cartItems.id, input.id));
      } else {
        await db
          .update(schema.cartItems)
          .set({ quantity: input.quantity })
          .where(eq(schema.cartItems.id, input.id));
      }
      return buildCart(input.cartKey);
    }),

  remove: base
    .input(keyInput.extend({ id: z.number() }))
    .handler(async ({ input }) => {
      await db.delete(schema.cartItems).where(eq(schema.cartItems.id, input.id));
      return buildCart(input.cartKey);
    }),

  clear: base.input(keyInput).handler(async ({ input }) => {
    await db
      .delete(schema.cartItems)
      .where(eq(schema.cartItems.cartKey, input.cartKey));
    return buildCart(input.cartKey);
  }),
};

function orderCode() {
  const n = Math.floor(Math.random() * 9000 + 1000);
  return `IO-${new Date().getFullYear()}-${n}`;
}

export const checkout = {
  create: base
    .input(
      keyInput.extend({
        customerName: z.string().min(3),
        email: z.string().email(),
        phone: z.string().min(8),
        document: z.string().min(6),
        address: z.string().min(5),
        city: z.string().min(2),
        state: z.string().min(2),
        zip: z.string().min(5),
        payment: z.enum(["pix", "cartao", "financiamento"]),
      }),
    )
    .handler(async ({ input, context }) => {
      const built = await buildCart(input.cartKey);
      if (!built.lines.length)
        throw new ORPCError("BAD_REQUEST", { message: "Carrinho vazio" });

      const session = await import("../auth").then((m) =>
        m.auth.api.getSession({ headers: context.headers }),
      );

      const [order] = await db
        .insert(schema.orders)
        .values({
          code: orderCode(),
          userId: session?.user.id ?? null,
          customerName: input.customerName,
          email: input.email,
          phone: input.phone,
          document: input.document,
          address: input.address,
          city: input.city,
          state: input.state,
          zip: input.zip,
          payment: input.payment,
          subtotal: built.subtotal,
          shipping: built.shipping,
          total: built.total,
        })
        .returning();

      await db.insert(schema.orderItems).values(
        built.lines.map((line) => ({
          orderId: order.id,
          kind: line.kind,
          productId: line.productId,
          name: line.name,
          image: line.image,
          variant: line.variant,
          unitPrice: line.unitPrice,
          quantity: line.quantity,
        })),
      );

      await db
        .delete(schema.cartItems)
        .where(eq(schema.cartItems.cartKey, input.cartKey));

      return { code: order.code };
    }),

  get: base.input(z.object({ code: z.string() })).handler(async ({ input }) => {
    const [order] = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.code, input.code));
    if (!order) throw new ORPCError("NOT_FOUND", { message: "Pedido não encontrado" });
    const items = await db
      .select()
      .from(schema.orderItems)
      .where(eq(schema.orderItems.orderId, order.id));
    return { order, items };
  }),
};
