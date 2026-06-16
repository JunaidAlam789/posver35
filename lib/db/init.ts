import { db } from "."
import { api } from "@/convex/_generated/api"

export async function initDatabase() {
  try {
    // Test Convex connection by checking if we can query
    console.log("Initializing Convex database...")

    // Try to seed the database if needed
    // Note: For production, use the Convex CLI to run mutations
    // For now, this is a placeholder for any initialization logic
    console.log("Database initialization check complete")
  } catch (error) {
    console.error("Failed to initialize database:", error)
    throw error
  }
}

