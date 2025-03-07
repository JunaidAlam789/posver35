"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import type { Product, Category, User, Order } from "@/lib/data/schema"
import { parse } from "papaparse"
import * as XLSX from "xlsx"

// Add this type definition
type ImportResult = {
  success: boolean
  count?: number
  error?: string
}

// Product actions
export async function getProducts(): Promise<Product[]> {
  try {
    const products = await db.product.findMany({
      include: {
        category: true,
      },
    })
    return products
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return []
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })
    return product
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error)
    return null
  }
}

export async function createProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
  try {
    const newProduct = await db.product.create({
      data: product,
    })
    revalidatePath("/products")
    return newProduct
  } catch (error) {
    console.error("Failed to create product:", error)
    throw error
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  try {
    const updatedProduct = await db.product.update({
      where: { id },
      data: product,
    })
    revalidatePath(`/products/${id}`)
    revalidatePath("/products")
    return updatedProduct
  } catch (error) {
    console.error(`Failed to update product with id ${id}:`, error)
    throw error
  }
}

export async function deleteProduct(id: string): Promise<Product> {
  try {
    const deletedProduct = await db.product.delete({
      where: { id },
    })
    revalidatePath("/products")
    return deletedProduct
  } catch (error) {
    console.error(`Failed to delete product with id ${id}:`, error)
    throw error
  }
}
// Category actions
export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await db.category.findMany()
    return categories
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}

// Customer actions
export async function getUsers(): Promise<User[]> {
  try {
    const customers = await db.user.findMany()
    return customers
  } catch (error) {
    console.error("Failed to fetch customers:", error)
    return []
  }
}

export async function getUser(id: string): Promise<User | null> {
  try {
    const customer = await db.user.findUnique({
      where: { id },
    })
    return customer
  } catch (error) {
    console.error(`Failed to fetch customer with id ${id}:`, error)
    return null
  }
}

export async function createUser(customer: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
  try {
    const newCustomer = await db.user.create({
      data: customer,
    })
    revalidatePath("/customers")
    return newCustomer
  } catch (error) {
    console.error("Failed to create customer:", error)
    throw error
  }
}

// Order actions
export async function getOrders(): Promise<Order[]> {
  try {
    const orders = await db.order.findMany({
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return orders
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return []
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const order = await db.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })
    return order
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
    // Generate a random order number
    const orderNumber = `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

    // Check if customer exists, if not create a new one
    let customer = await db.customer.findUnique({
      where: { email: input.customerInfo.email },
    })

    if (!customer) {
      customer = await db.customer.create({
        data: {
          name: input.customerInfo.name,
          email: input.customerInfo.email,
          address: input.customerInfo.address,
        },
      })
    }

    // Create the order
    const order = await db.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        subtotal: input.subtotal,
        tax: input.tax,
        total: input.total,
        paymentMethod: input.paymentMethod,
        notes: input.notes,
        shippingAddress: {
          address: input.customerInfo.address,
          city: input.customerInfo.city,
          state: input.customerInfo.state,
          zipCode: input.customerInfo.zipCode,
        },
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Update product stock
    for (const item of input.items) {
      await db.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    }

    revalidatePath("/orders")
    return order
  } catch (error) {
    console.error("Failed to create order:", error)
    throw error
  }
}

export async function updateOrderStatus(id: string, status: string): Promise<Order> {
  try {
    const updatedOrder = await db.order.update({
      where: { id },
      data: {
        status,
      },
    })
    revalidatePath(`/orders/${id}`)
    revalidatePath("/orders")
    return updatedOrder
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
      // Parse CSV
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
      // Parse Excel
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
      // Validate required fields
      if (!product.name || !product.price || !product.sku || !product.categoryId) {
        throw new Error(`Missing required fields for product: ${JSON.stringify(product)}`)
      }

      // Transform to correct types
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
        db.product.create({
          data: product,
        }),
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
  const [totalOrders, totalProducts, totalCustomers, orders] = await Promise.all([
    db.order.count(),
    db.product.count(),
    db.user.count({
      where: {
        role: "CUSTOMER",
      },
    }),
    db.order.findMany({
      select: {
        total: true,
      },
    }),
  ])

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

  return {
    totalOrders,
    totalProducts,
    totalCustomers,
    totalRevenue,
  }
}

export async function getRecentOrders(limit = 5) {
  return db.order.findMany({
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  })
}

export async function getLowStockProducts(threshold = 10) {
  return db.product.findMany({
    where: {
      stock: {
        lte: threshold,
      },
    },
    include: {
      category: true,
    },
  })
}

