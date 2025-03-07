import { PrismaClient } from "@prisma/client"
import { categories, products, users, orders } from "../lib/data/mock"

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Seed categories
  console.log("Seeding categories...")
  const categoryPromises = categories.map((category) =>
    prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        description: category.description,
      },
    }),
  )
  await Promise.all(categoryPromises)

  // Seed products
  console.log("Seeding products...")
  const productPromises = products.map((product) =>
    prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        sku: product.sku,
        categoryId: product.categoryId,
        stock: product.stock,
      },
    }),
  )
  await Promise.all(productPromises)

  // Seed users
  console.log("Seeding users...")
  const userPromises = users.map((user) =>
    prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    }),
  )
  await Promise.all(userPromises)

  // Seed orders
  console.log("Seeding orders...")
  const orderPromises = orders.map((order) =>
    prisma.order.create({
      data: {
        id: order.id,
        customerId: order.customerId,
        status: order.status,
        total: order.total,
        items: {
          create: order.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        createdAt: order.createdAt,
      },
    }),
  )
  await Promise.all(orderPromises)

  console.log("Seeding completed.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

