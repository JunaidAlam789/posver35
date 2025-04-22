"use client"

import { useCart } from "@/lib/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function CartSummary() {
  const { items, removeItem, updateQuantity, subtotal, tax, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Your cart is empty</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(({ product, quantity }) => (
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
                <TableCell>
                  <Input
                    type="number"
                    min={1}
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => updateQuantity(product.id, Number.parseInt(e.target.value) || 1)}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>{formatCurrency(Number(product.price))}</TableCell>
                <TableCell>{formatCurrency(Number(product.price) * quantity)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => removeItem(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Subtotal</TableCell>
              <TableCell className="text-right">{formatCurrency(subtotal)}</TableCell>
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>Tax (10%)</TableCell>
              <TableCell className="text-right">{formatCurrency(tax)}</TableCell>
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(total)}</TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
