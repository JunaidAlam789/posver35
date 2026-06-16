import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.string(),
    avatar: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .searchIndex("search_by_name", {
      searchField: "name",
    }),

  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
  }).searchIndex("search_by_name", {
    searchField: "name",
  }),

  products: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    image: v.optional(v.string()),
    sku: v.string(),
    stock: v.number(),
    categoryId: v.id("categories"),
  })
    .index("by_categoryId", ["categoryId"])
    .index("by_sku", ["sku"])
    .searchIndex("search_by_name", {
      searchField: "name",
    }),

  orders: defineTable({
    customerId: v.id("users"),
    status: v.string(),
    total: v.number(),
    createdAt: v.number(), // timestamp in milliseconds
    updatedAt: v.number(),
  })
    .index("by_customerId", ["customerId"])
    .index("by_createdAt", ["createdAt"]),

  orderItems: defineTable({
    orderId: v.id("orders"),
    productId: v.id("products"),
    quantity: v.number(),
    price: v.number(),
  })
    .index("by_orderId", ["orderId"])
    .index("by_productId", ["productId"]),

  salesAnalytics: defineTable({
    orderId: v.id("orders"),
    productId: v.id("products"),
    productName: v.string(),
    categoryId: v.id("categories"),
    categoryName: v.string(),
    customerId: v.id("users"),
    customerName: v.string(),
    quantity: v.number(),
    unitPrice: v.number(),
    revenue: v.number(),
    cost: v.number(),
    profit: v.number(),
    timestamp: v.number(),
    hour: v.number(),
    day: v.number(),
    month: v.number(),
    year: v.number(),
    dayOfWeek: v.number(),
  })
    .index("by_categoryId", ["categoryId"])
    .index("by_customerId", ["customerId"])
    .index("by_dayOfWeek", ["dayOfWeek"])
    .index("by_hour", ["hour"])
    .index("by_productId", ["productId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_year_month_day", ["year", "month", "day"]),
});
