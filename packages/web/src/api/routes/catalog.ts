import { z } from "zod";
import { and, asc, desc, eq, gte, inArray, lte, ne, sql } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";

const listInput = z
  .object({
    families: z.array(z.string()).optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    minDisplacement: z.number().optional(),
    years: z.array(z.number()).optional(),
    sort: z
      .enum(["destaque", "preco-asc", "preco-desc", "potencia", "novidade"])
      .default("destaque"),
    search: z.string().optional(),
  })
  .default({ sort: "destaque" });

export const motorcycles = {
  list: base.input(listInput).handler(async ({ input }) => {
    const filters = [];
    if (input.families?.length)
      filters.push(inArray(schema.motorcycles.family, input.families));
    if (input.minPrice != null)
      filters.push(gte(schema.motorcycles.price, input.minPrice));
    if (input.maxPrice != null)
      filters.push(lte(schema.motorcycles.price, input.maxPrice));
    if (input.minDisplacement != null)
      filters.push(gte(schema.motorcycles.displacement, input.minDisplacement));
    if (input.years?.length)
      filters.push(inArray(schema.motorcycles.year, input.years));
    if (input.search?.trim())
      filters.push(
        sql`lower(${schema.motorcycles.name}) like ${`%${input.search.trim().toLowerCase()}%`}`,
      );

    const order = {
      destaque: [desc(schema.motorcycles.featured), asc(schema.motorcycles.price)],
      "preco-asc": [asc(schema.motorcycles.price)],
      "preco-desc": [desc(schema.motorcycles.price)],
      potencia: [desc(schema.motorcycles.power)],
      novidade: [desc(schema.motorcycles.year), asc(schema.motorcycles.name)],
    }[input.sort];

    return db
      .select()
      .from(schema.motorcycles)
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(...order);
  }),

  featured: base.handler(() =>
    db
      .select()
      .from(schema.motorcycles)
      .where(eq(schema.motorcycles.featured, true))
      .orderBy(asc(schema.motorcycles.price))
      .limit(4),
  ),

  facets: base.handler(async () => {
    const rows = await db
      .select({
        family: schema.motorcycles.family,
        year: schema.motorcycles.year,
        price: schema.motorcycles.price,
        displacement: schema.motorcycles.displacement,
      })
      .from(schema.motorcycles);
    return {
      families: [...new Set(rows.map((r) => r.family))].sort(),
      years: [...new Set(rows.map((r) => r.year))].sort((a, b) => b - a),
      minPrice: Math.min(...rows.map((r) => r.price)),
      maxPrice: Math.max(...rows.map((r) => r.price)),
      displacements: [...new Set(rows.map((r) => r.displacement))].sort(
        (a, b) => a - b,
      ),
    };
  }),

  get: base
    .input(z.object({ slug: z.string() }))
    .handler(async ({ input }) => {
      const [bike] = await db
        .select()
        .from(schema.motorcycles)
        .where(eq(schema.motorcycles.slug, input.slug));
      if (!bike) throw new ORPCError("NOT_FOUND", { message: "Modelo não encontrado" });
      const related = await db
        .select()
        .from(schema.motorcycles)
        .where(
          and(
            eq(schema.motorcycles.family, bike.family),
            ne(schema.motorcycles.id, bike.id),
          ),
        )
        .limit(3);
      return { bike, related };
    }),

  compare: base.handler(() =>
    db
      .select()
      .from(schema.motorcycles)
      .where(eq(schema.motorcycles.featured, true))
      .orderBy(asc(schema.motorcycles.price))
      .limit(4),
  ),
};

export const partsRouter = {
  list: base
    .input(
      z
        .object({ category: z.string().optional(), limit: z.number().optional() })
        .default({}),
    )
    .handler(({ input }) => {
      const query = db
        .select()
        .from(schema.parts)
        .where(
          input.category && input.category !== "Todos"
            ? eq(schema.parts.category, input.category)
            : undefined,
        )
        .orderBy(asc(schema.parts.name));
      return input.limit ? query.limit(input.limit) : query;
    }),

  categories: base.handler(async () => {
    const rows = await db.select({ category: schema.parts.category }).from(schema.parts);
    return [...new Set(rows.map((r) => r.category))].sort();
  }),
};

export const dealers = {
  list: base.handler(() =>
    db.select().from(schema.dealers).orderBy(asc(schema.dealers.city)),
  ),
};

export const blog = {
  list: base
    .input(z.object({ limit: z.number().optional() }).default({}))
    .handler(({ input }) => {
      const query = db
        .select()
        .from(schema.posts)
        .orderBy(desc(schema.posts.publishedAt));
      return input.limit ? query.limit(input.limit) : query;
    }),

  get: base.input(z.object({ slug: z.string() })).handler(async ({ input }) => {
    const [post] = await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.slug, input.slug));
    if (!post) throw new ORPCError("NOT_FOUND", { message: "Post não encontrado" });
    const more = await db
      .select()
      .from(schema.posts)
      .where(ne(schema.posts.id, post.id))
      .orderBy(desc(schema.posts.publishedAt))
      .limit(3);
    return { post, more };
  }),
};

/** Feature router: catalog surface (bikes, parts, dealers, editorial). */
export const catalog = { motorcycles, parts: partsRouter, dealers, blog };
