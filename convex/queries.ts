import { query } from "./_generated/server";
import { v } from "convex/values";

// Product queries
export const getProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .collect();
  },
});

export const getProduct = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Category queries
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

// User queries
export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Order queries
export const getOrders = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db
      .query("orders")
      .order("desc")
      .collect();

    // Enrich orders with user and items
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const user = await ctx.db.get(order.customerId);
        const items = await ctx.db
          .query("orderItems")
          .withIndex("by_orderId", (q) => q.eq("orderId", order._id))
          .collect();

        // Enrich items with product info
        const enrichedItems = await Promise.all(
          items.map(async (item) => {
            const product = await ctx.db.get(item.productId);
            return { ...item, Product: product };
          })
        );

        return { ...order, User: user, OrderItem: enrichedItems };
      })
    );

    return enrichedOrders;
  },
});

export const getOrder = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) return null;

    const user = await ctx.db.get(order.customerId);
    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.id))
      .collect();

    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return { ...item, Product: product };
      })
    );

    return { ...order, User: user, OrderItem: enrichedItems };
  },
});

// Dashboard stats query
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const totalOrders = await ctx.db.query("orders").count();
    const totalProducts = await ctx.db.query("products").count();
    const totalCustomersResult = await ctx.db
      .query("users")
      .collect();
    const totalCustomers = totalCustomersResult.filter(
      (u) => u.role === "CUSTOMER"
    ).length;

    const orders = await ctx.db.query("orders").collect();
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    return {
      totalOrders,
      totalProducts,
      totalCustomers,
      totalRevenue,
    };
  },
});

// Recent orders query
export const getRecentOrders = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;
    const orders = await ctx.db
      .query("orders")
      .order("desc")
      .take(limit);

    // Enrich orders with user and items
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const user = await ctx.db.get(order.customerId);
        const items = await ctx.db
          .query("orderItems")
          .withIndex("by_orderId", (q) => q.eq("orderId", order._id))
          .collect();

        const enrichedItems = await Promise.all(
          items.map(async (item) => {
            const product = await ctx.db.get(item.productId);
            return { ...item, Product: product };
          })
        );

        return { ...order, User: user, OrderItem: enrichedItems };
      })
    );

    return enrichedOrders;
  },
});

// Low stock products query
export const getLowStockProducts = query({
  args: { threshold: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const threshold = args.threshold ?? 10;
    const products = await ctx.db.query("products").collect();

    const lowStockProducts = products.filter((p) => p.stock <= threshold);

    // Enrich with category info
    const enriched = await Promise.all(
      lowStockProducts.map(async (product) => {
        const category = await ctx.db.get(product.categoryId);
        return { ...product, Category: category };
      })
    );

    return enriched;
  },
});
