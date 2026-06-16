# Convex Database Migration Guide

This project has been migrated from Prisma to Convex. Here's what you need to know:

## Setup

1. **Install Convex CLI:**
   ```bash
   npm install -g convex
   # or
   pnpm add -g convex
   ```

2. **Create a Convex project:**
   ```bash
   convex auth
   convex deploy
   ```

3. **Get your deployment URL:**
   After deploying, you'll receive a `NEXT_PUBLIC_CONVEX_URL`. Add it to your `.env.local`:
   ```
   NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
   ```

4. **Seed the database (optional):**
   Use the Convex Dashboard or run:
   ```bash
   convex run mutations:seedDatabase
   ```

## File Structure

- `/convex/schema.ts` - Defines database tables and indexes
- `/convex/queries.ts` - Read operations (replaces Prisma queries)
- `/convex/mutations.ts` - Write operations (replaces Prisma mutations)
- `/lib/data/actions.ts` - Server actions that call Convex functions
- `/lib/data/schema.ts` - TypeScript types compatible with Convex

## Key Changes

### Before (Prisma):
```typescript
import { db } from "@/lib/db"
const products = await db.product.findMany()
```

### After (Convex):
```typescript
import { api } from "@/convex/_generated/api"
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
const products = await convex.query(api.queries.getProducts)
```

## Database Schema

The following tables are available:
- `users` - User accounts with role-based access
- `categories` - Product categories
- `products` - Product inventory
- `orders` - Customer orders
- `orderItems` - Individual items in orders
- `salesAnalytics` - Analytics data for sales

## Development

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Watch for Convex changes:
   ```bash
   convex dev
   ```

3. Access the Convex Dashboard:
   - Go to https://dashboard.convex.dev/
   - Sign in and select your project
   - View and query data in real-time

## Deployment

1. Deploy to production:
   ```bash
   convex deploy --prod
   ```

2. Ensure environment variable is set in your hosting provider

## Migration Notes

- All timestamps are stored in milliseconds (Convex standard)
- Convex IDs are typed as `Id<"tableName">`
- Relations are handled differently - load related data in queries
- For complex queries, compose multiple queries or use a single query with nested lookups

For more information, visit [Convex Documentation](https://docs.convex.dev)
