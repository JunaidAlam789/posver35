import { db as prisma } from "."

export async function initDatabase() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log("Database connection successful")

    // Check if we need to seed the database
    const userCount = await prisma.user.count()
    if (userCount === 0) {
      console.log("Database is empty, running seed script...")
      // You would typically run the seed script here
      // For development, you can run `npm run db:seed` manually
    }
  } catch (error) {
    console.error("Failed to initialize database:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

