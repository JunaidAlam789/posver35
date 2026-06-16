"use server"

import { revalidatePath } from "next/cache"
import type { Product, Category, User, Order } from "@/lib/data/schema"
import { parse } from "papaparse"
import * as XLSX from "xlsx"
import { api } from "@/convex/_generated/api"
import { ConvexHttpClient } from "convex/browser"

// Create a Convex client for server actions
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

type ImportResult = {
  success: boolean
  count?: number
  error?: string
}

// Product actions
export async function getProducts(): Promise<Product[]> {
  try {
    const products = await convex.query(api.queries.getProducts)
    return products as Product[]
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return []
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await convex.query(api.queries.getProduct, { id: id as any })
    return product as Product | null
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error)
    return null
  }
}

type CreateProductInput = Omit<Product, "id" | "Category" | "OrderItem">

export async function createProduct(product: CreateProductInput): Promise<Product> {
  try {
    const newProduct = await convex.mutation(api.mutations.createProduct, product as any)
    revalidatePath("/products")
    return newProduct as Product
  } catch (error) {
    console.error("Failed to create product:", error)
    throw error
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  try {
    const updatedProduct = await convex.mutation(api.mutations.updateProduct, {
      id: id as any,
      ...product,
    })
    revalidatePath(`/products/${id}`)
    revalidatePath("/products")
    return updatedProduct as Product
  } catch (error) {
    console.error(`Failed to update product with id ${id}:`, error)
    throw error
  }
}

export async function deleteProduct(id: string): Promise<Product> {
  try {
    const deletedProduct = await convex.mutation(api.mutations.deleteProduct, { id: id as any })
    revalidatePath("/products")
    return deletedProduct as Product
  } catch (error) {
    console.error(`Failed to delete product with id ${id}:`, error)
    throw error
  }
}

// Category actions
export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await convex.query(api.queries.getCategories)
    return categories as Category[]
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}

// Customer actions
export async function getUsers(): Promise<User[]> {
  try {
    const users = await convex.query(api.queries.getUsers)
    return users as User[]
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return []
  }
}

export async function getUser(id: string): Promise<User | null> {
  try {
    const user = await convex.query(api.queries.getUser, { id: id as any })
    return user as User | null
  } catch (error) {
    console.error(`Failed to fetch user with id ${id}:`, error)
    return null
  }
}

type CreateUserInput = Omit<User, "id" | "Order">

export async function createUser(customer: CreateUserInput): Promise<User> {
  try {
    const newUser = await convex.mutation(api.mutations.createUser, customer as any)
    revalidatePath("/customers")
    return newUser as User
  } catch (error) {
    console.error("Failed to create user:", error)
    throw error
  }
}

// Order actions
export async function getOrders(): Promise<Order[]> {
  try {
    const orders = await convex.query(api.queries.getOrders)
    return orders as Order[]
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return []
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const order = await convex.query(api.queries.getOrder, { id: id as any })
    return order as Order | null
  } catch (error) {
    console.error(`Failed to fetch order with id ${id}:`, error)
    return null
  }
}

export type CreateOrderInput = {
  customerInfo: {
    name: string
    email: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  items: {
    productId: string
    quantity: number
    price: number
  }[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  notes?: string
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  try {
    // Check if customer exists, if not create a new one
    let customer = await convex.query(api.queries.getUserByEmail, {
      email: input.customerInfo.email,
    })

    if (!customer) {
      customer = await convex.mutation(api.mutations.createUser, {
        name: input.customerInfo.name,
        email: input.customerInfo.email,
        role: "CUSTOMER",
      })
    }

    // Create the order
    const order = await convex.mutation(api.mutations.createOrder, {
      customerId: customer._id,
      status: "pending",
      total: input.total,
      items: input.items.map((item) => ({
        productId: item.productId as any,
        quantity: item.quantity,
        price: item.price,
      })),
    })

    revalidatePath("/orders")
    return order as Order
  } catch (error) {
    console.error("Failed to create order:", error)
    throw error
  }
}

export async function updateOrderStatus(id: string, status: string): Promise<Order> {
  try {
    const updatedOrder = await convex.mutation(api.mutations.updateOrderStatus, {
      id: id as any,
      status,
    })
    revalidatePath(`/orders/${id}`)
    revalidatePath("/orders")
    return updatedOrder as Order
  } catch (error) {
    console.error(`Failed to update order status with id ${id}:`, error)
    throw error
  }
}

export async function importProducts(formData: FormData): Promise<ImportResult> {
  try {
    const file = formData.get("file") as File
    if (!file) {
      return { success: false, error: "No file provided" }
    }

    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    let products: any[] = []

    // Parse the file based on its extension
    if (fileExtension === "csv") {
      const text = await file.text()
      const result = parse(text, {
        header: true,
        skipEmptyLines: true,
      })

      if (result.errors.length > 0) {
        return {
          success: false,
          error: `CSV parsing error: ${result.errors[0].message}`,
        }
      }

      products = result.data
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      products = XLSX.utils.sheet_to_json(worksheet)
    } else {
      return { success: false, error: "Unsupported file format" }
    }

    if (products.length === 0) {
      return { success: false, error: "No products found in the file" }
    }

    // Validate and transform the data
    const validatedProducts = products.map((product) => {
      if (!product.name || !product.price || !product.sku || !product.categoryId) {
        throw new Error(`Missing required fields for product: ${JSON.stringify(product)}`)
      }

      return {
        name: String(product.name),
        description: product.description ? String(product.description) : "",
        price: Number(product.price),
        sku: String(product.sku),
        stock: product.stock ? Number(product.stock) : 0,
        categoryId: String(product.categoryId),
        image: product.image ? String(product.image) : null,
      }
    })

    // Insert products into the database
    const createdProducts = await Promise.all(
      validatedProducts.map((product) =>
        convex.mutation(api.mutations.createProduct, product as any),
      ),
    )

    revalidatePath("/products")

    return {
      success: true,
      count: createdProducts.length,
    }
  } catch (error) {
    console.error("Failed to import products:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Stats
export async function getDashboardStats() {
  const stats = await convex.query(api.queries.getDashboardStats)
  return stats
}

export async function getRecentOrders(limit = 5) {
  return convex.query(api.queries.getRecentOrders, { limit })
}

export async function getLowStockProducts(threshold = 10): Promise<Product[]> {
  return convex.query(api.queries.getLowStockProducts, { threshold }) as Promise<Product[]>
}
