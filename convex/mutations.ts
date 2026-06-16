import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Product mutations
export const createProduct = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    image: v.optional(v.string()),
    sku: v.string(),
    stock: v.number(),
    categoryId: v.id("categories"),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("products", args);
    return await ctx.db.get(id);
  },
});

export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    image: v.optional(v.string()),
    sku: v.optional(v.string()),
    stock: v.optional(v.number()),
    categoryId: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const updateData = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, updateData);
    return await ctx.db.get(id);
  },
});

export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    await ctx.db.delete(args.id);
    return product;
  },
});

// Category mutations
export const createCategory = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("categories", args);
    return await ctx.db.get(id);
  },
});

// User mutations
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("users", {
      ...args,
      role: args.role ?? "customer",
    });
    return await ctx.db.get(id);
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const updateData = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, updateData);
    return await ctx.db.get(id);
  },
});

// Order mutations
export const createOrder = mutation({
  args: {
    customerId: v.id("users"),
    status: v.optional(v.string()),
    total: v.number(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        price: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Create the order
    const orderId = await ctx.db.insert("orders", {
      customerId: args.customerId,
      status: args.status ?? "pending",
      total: args.total,
      createdAt: now,
      updatedAt: now,
    });

    // Create order items
    for (const item of args.items) {
      await ctx.db.insert("orderItems", {
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });

      // Update product stock
      const product = await ctx.db.get(item.productId);
      if (product) {
        await ctx.db.patch(item.productId, {
          stock: product.stock - item.quantity,
        });
      }
    }

    return await ctx.db.get(orderId);
  },
});

export const updateOrderStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
    return await ctx.db.get(args.id);
  },
});

// Seed data mutation
export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingUsers = await ctx.db.query("users").collect();
    if (existingUsers.length > 0) {
      return { message: "Database already seeded" };
    }

    // Create users
    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        role: "ADMIN",
        avatar: "/avatars/admin.png",
      },
      {
        name: "Staff User",
        email: "staff@example.com",
        role: "STAFF",
        avatar: "/avatars/staff.png",
      },
      {
        name: "John Doe",
        email: "john@example.com",
        role: "CUSTOMER",
        avatar: "/avatars/john.png",
      },
    ];

    const userIds = await Promise.all(
      users.map((user) => ctx.db.insert("users", user))
    );

    // Create categories
    const categories = [
      {
        name: "Beverages",
        description: "Soft drinks, coffees, teas, beers, and ales",
      },
      {
        name: "Food",
        description: "Sweet and savory snacks",
      },
      {
        name: "Electronics",
        description: "Phones, tablets, laptops, and accessories",
      },
      {
        name: "Stationery",
        description: "Office and school supplies",
      },
    ];

    const categoryIds = await Promise.all(
      categories.map((cat) => ctx.db.insert("categories", cat))
    );

    // Create products
    const products = [
      {
        name: "Coffee",
        description: "Premium Arabica coffee",
        price: 3.99,
        image: "/products/coffee.jpg",
        sku: "BEV001",
        categoryId: categoryIds[0],
        stock: 100,
      },
      {
        name: "Green Tea",
        description: "Organic green tea",
        price: 2.99,
        image: "/products/tea.jpg",
        sku: "BEV002",
        categoryId: categoryIds[0],
        stock: 150,
      },
      {
        name: "Chocolate Bar",
        description: "Dark chocolate",
        price: 1.99,
        image: "/products/chocolate.jpg",
        sku: "FOOD001",
        categoryId: categoryIds[1],
        stock: 200,
      },
      {
        name: "Potato Chips",
        description: "Original flavor",
        price: 2.49,
        image: "/products/chips.jpg",
        sku: "FOOD002",
        categoryId: categoryIds[1],
        stock: 300,
      },
      {
        name: "Wireless Earbuds",
        description: "Bluetooth 5.0",
        price: 49.99,
        image: "/products/earbuds.jpg",
        sku: "ELEC001",
        categoryId: categoryIds[2],
        stock: 50,
      },
    ];

    const productIds = await Promise.all(
      products.map((prod) => ctx.db.insert("products", prod))
    );

    return {
      message: "Database seeded successfully",
      userCount: userIds.length,
      categoryCount: categoryIds.length,
      productCount: productIds.length,
    };
  },
});
