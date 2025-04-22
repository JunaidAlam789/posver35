"use client"

import { useCart } from "@/lib/context/cart-context"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function Cart() {
  const { items, removeItem, updateQuantity, subtotal, tax, total } = useCart()

  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">{itemCount}</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 p-4">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button asChild className="mt-4">
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 relative rounded-md overflow-hidden bg-muted">
                      <Image
                        src={item.product.image || "/placeholder.svg?height=64&width=64"}
                        alt={item.product.name}
                        className="object-cover"
                        fill
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium leading-none truncate">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{formatCurrency(Number(item.product.price))}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                          }}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          min={1}
                          max={item.product.stock}
                          value={item.quantity}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value)
                            if (!isNaN(value) && value > 0 && value <= item.product.stock) {
                              updateQuantity(item.product.id, value)
                            }
                          }}
                          className="h-8 w-14 text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            if (item.quantity < item.product.stock) {
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                          }}
                          disabled={item.quantity >= item.product.stock}
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-auto text-destructive"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="pt-4">
              <Separator className="mb-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <SheetFooter className="mt-4">
                <Button asChild className="w-full">
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
