
import { Id } from "convex/values"

export enum Role {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  CUSTOMER = "CUSTOMER",
}

export type User = {
  _id?: Id<"users">
  id?: string
  name: string
  email: string
  role: string
  avatar?: string | null
  Order?: Order[]
}

export type Product = {
  _id?: Id<"products">
  id?: string
  name: string
  description?: string | null
  price: number
  image?: string | null
  sku: string
  categoryId: Id<"categories"> | string
  stock: number
  Category?: Category
  OrderItem?: OrderItem[]
}

export type Category = {
  _id?: Id<"categories">
  id?: string
  name: string
  description?: string | null
  Product?: Product[]
}

export type Order = {
  _id?: Id<"orders">
  id?: string
  customerId: Id<"users"> | string
  status: string
  total: number
  createdAt: number | Date
  updatedAt: number | Date
  User?: User
  OrderItem?: OrderItem[]
}

export type OrderItem = {
  _id?: Id<"orderItems">
  id?: string
  orderId: Id<"orders"> | string
  productId: Id<"products"> | string
  quantity: number
  price: number
  Order?: Order
  Product?: Product
}

export type Payment = {
  id: string
  orderId: string
  amount: number
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
  method: "CREDIT_CARD" | "PAYPAL" | "CASH"
}


