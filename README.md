# POS (Point of Sale) System

A modern Point of Sale system built with Next.js 14, Prisma, PostgreSql, and shadcn/ui.

## Features

- 📊 Dashboard with real-time analytics
- 🛍️ Product management
- 📦 Order processing
- 👥 Customer management
- 🛒 Checkout system
- 🎨 Dark/Light mode
- 📱 Responsive design

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Postgresql] (https://www.postgresql.org/) Database
- [SQLite](https://www.sqlite.org/) - Database
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pos.git
cd pos

https://www.prisma.io/orm

pnpm install prisma --save-dev

pnpm prisma init

pnpm i @prisma/client

pnpm prisma migrate dev --name init

pnpm prisma db push
pnpm prisma db pull
pnpm prisma db generate
pnpm prisma studio

https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help
for deployment on vercel
"scripts": {
    "postinstall": "prisma generate",



pnpm prisma db pull
pnpm prisma generate

generator client {
  provider = "prisma-client-js"
  output   = "app/generated/prisma/client"
}



generator client {
  provider = "prisma-client-js"
 }

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  role      Role     @default(CUSTOMER)
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]

  @@map("users")
}

model Product {
  id          String      @id @default(cuid())
  name        String
  description String
  price       Float
  sku         String      @unique
  categoryId  String
  stock       Int
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  image       String?
  orderItems  OrderItem[]
  category    Category    @relation(fields: [categoryId], references: [id])

  @@map("products")
}

model Category {
  id          String    @id @default(cuid())
  name        String
  description String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  products    Product[]

  @@map("categories")
}

model Order {
  id         String      @id @default(cuid())
  customerId String
  status     OrderStatus @default(PENDING)
  total      Float
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  items      OrderItem[]
  customer   User        @relation(fields: [customerId], references: [id])

  @@map("orders")
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Float
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  order     Order    @relation(fields: [orderId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])

  @@map("order_items")
}

enum Role {
  ADMIN
  STAFF
  CUSTOMER
}

enum OrderStatus {
  PENDING
  PROCESSING
  COMPLETED
  DELIVERED
  CANCELLED
}
