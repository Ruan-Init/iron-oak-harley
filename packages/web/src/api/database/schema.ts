import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export * from "./auth-schema";

/** Motos do catálogo. Preços em centavos de BRL. */
export const motorcycles = sqliteTable("motorcycles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  family: text("family").notNull(),
  year: integer("year").notNull(),
  price: integer("price").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  engine: text("engine").notNull(),
  displacement: integer("displacement").notNull(),
  power: integer("power").notNull(),
  torque: integer("torque").notNull(),
  weight: integer("weight").notNull(),
  seatHeight: integer("seat_height").notNull(),
  fuel: real("fuel").notNull(),
  consumption: real("consumption").notNull(),
  colors: text("colors", { mode: "json" }).$type<string[]>().notNull(),
  image: text("image").notNull(),
  gallery: text("gallery", { mode: "json" }).$type<string[]>().notNull(),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  stock: integer("stock").notNull().default(3),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

/** Peças e acessórios. */
export const parts = sqliteTable("parts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  stock: integer("stock").notNull().default(20),
});

/** Itens de carrinho, agrupados por cartKey (UUID no localStorage). */
export const cartItems = sqliteTable("cart_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cartKey: text("cart_key").notNull(),
  kind: text("kind").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  variant: text("variant"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  userId: text("user_id"),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  document: text("document").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  payment: text("payment").notNull(),
  subtotal: integer("subtotal").notNull(),
  shipping: integer("shipping").notNull(),
  total: integer("total").notNull(),
  status: text("status").notNull().default("confirmado"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull(),
  kind: text("kind").notNull(),
  productId: integer("product_id").notNull(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  variant: text("variant"),
  unitPrice: integer("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
});

export const testRides = sqliteTable("test_rides", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  motorcycleId: integer("motorcycle_id").notNull(),
  dealerId: integer("dealer_id").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  license: text("license").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("solicitado"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const dealers = sqliteTable("dealers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  hours: text("hours").notNull(),
  image: text("image").notNull(),
});

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  image: text("image").notNull(),
  readMinutes: integer("read_minutes").notNull(),
  publishedAt: text("published_at").notNull(),
});

export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
