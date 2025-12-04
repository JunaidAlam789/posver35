
enum Role {
  ADMINS,
  STAFFS,
  CUSTOMERS
}


export type User = {
  id: string
  name: string
  email: string
  //role: "ADMIN" | "STAFF" | "CUSTOMER"
  //role: Role
  role: string
  avatar?: string | null
}

// enum Role {
//   ADMIN = "ADMIN",
//   STAFF = "STAFF",
//   CUSTOMER = "CUSTOMER",
// }


export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  sku: string
  categoryId: string
  stock: number
  //category?: Category
}

export type Category = {
  id: string
  name: string
  description: string | null
}

export type Order = {
  id: string
  customerId: string
  //status: "PENDING" | "PROCESSING" | "COMPLETED" | "DELIVERED" | "CANCELLED"
  status: string
  total: number  
  createdAt: Date
  User: User  
  OrderItem: OrderItem[]
}

export type OrderItem = {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  Order: Order
  Product: Product
}

export type Payment = {
  id: string
  orderId: string
  amount: number
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
  method: "CREDIT_CARD" | "PAYPAL" | "CASH"
}

