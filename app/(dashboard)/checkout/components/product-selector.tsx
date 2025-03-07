"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/data/schema"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useCart } from "@/lib/context/cart-context"
import { getProducts } from "@/lib/data/actions"
import { formatCurrency } from "@/lib/utils" // Updated import path

export function ProductSelector() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.id.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase()),
  )

  const handleQuantityChange = (productId: string, value: string) => {
    const quantity = Number.parseInt(value) || 0
    setQuantities((prev) => ({ ...prev, [productId]: quantity }))
  }

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1
    addItem(product, quantity)
    setQuantities((prev) => ({ ...prev, [product.id]: 0 }))
  }

  if (loading) {
    return <div>Loading products...</div>
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search products by name or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={product.image || "/placeholder.svg?height=48&width=48"}
                        alt={product.name}
                        className="object-cover"
                        width={48}
                        height={48}
                        priority
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.sku}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(Number(product.price))}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    max={product.stock}
                    value={quantities[product.id] || ""}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={!quantities[product.id] || quantities[product.id] <= 0}
                  >
                    Add to Cart
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

