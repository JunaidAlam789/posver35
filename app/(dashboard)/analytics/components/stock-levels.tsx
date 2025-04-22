"use client"

import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import type { Category, Product } from "@/lib/data/schema"

interface StockLevelsProps {
  products?: Product[]
  categories?: Category[]
}

export function StockLevels({ products = [], categories = [] }: StockLevelsProps) {
  const [stockByCategory, setStockByCategory] = useState<
    Array<{
      name: string
      stock: number
      percentage: number
    }>
  >([])

  useEffect(() => {
    if (products.length && categories.length) {
      const stockData = categories.map((category) => {
        const categoryProducts = products.filter((product) => product.categoryId === category.id)
        const totalStock = categoryProducts.reduce((sum, product) => sum + product.stock, 0)
        const maxStock = categoryProducts.length * 100 // Assuming max stock is 100 per product
        const percentage = (totalStock / maxStock) * 100

        return {
          name: category.name,
          stock: totalStock,
          percentage,
        }
      })

      setStockByCategory(stockData)
    }
  }, [products, categories])

  return (
    <div className="space-y-4">
      {stockByCategory.map((category) => (
        <div key={category.name} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{category.name}</span>
            <span className="text-muted-foreground">{category.stock} items</span>
          </div>
          <Progress value={category.percentage} className="h-2" />
        </div>
      ))}
    </div>
  )
}
