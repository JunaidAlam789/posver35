import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function GET() {
  try {
    // Run the seed script
    const { stdout, stderr } = await execAsync(
      'npx ts-node --compiler-options \'{"module":"CommonJS"}\' lib/db/seed.ts',
    )

    if (stderr) {
      console.error("Error seeding database:", stderr)
      return NextResponse.json({ error: stderr }, { status: 500 })
    }

    return NextResponse.json({ message: "Database seeded successfully", details: stdout })
  } catch (error) {
    console.error("Failed to seed database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
