"use client"

import { formatCurrency } from "@/lib/utils"
import type { CartItem } from "@/lib/context/cart-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import { useRef } from "react"

interface ReceiptProps {
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  orderId: string
  date: Date
  onClose: () => void
}

export function Receipt({ items, subtotal, tax, total, orderId, date, onClose }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const content = receiptRef.current
    if (!content) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printDocument = printWindow.document
    printDocument.write(`
      <html>
        <head>
          <title>Receipt #${orderId}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 400px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .separator {
              border-top: 1px dashed #ccc;
              margin: 10px 0;
            }
            .total {
              font-weight: bold;
              margin-top: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>POS System</h2>
            <p>Receipt #${orderId}</p>
            <p>${date.toLocaleString()}</p>
          </div>
          <div>
            ${items
              .map(
                (item) => `
              <div class="item">
                <span>${item.quantity} x ${item.product.name}</span>
                <span>${formatCurrency(Number(item.product.price) * item.quantity)}</span>
              </div>
            `,
              )
              .join("")}
          </div>
          <div class="separator"></div>
          <div class="item">
            <span>Subtotal</span>
            <span>${formatCurrency(subtotal)}</span>
          </div>
          <div class="item">
            <span>Tax (10%)</span>
            <span>${formatCurrency(tax)}</span>
          </div>
          <div class="separator"></div>
          <div class="item total">
            <span>Total</span>
            <span>${formatCurrency(total)}</span>
          </div>
          <div class="footer">
            <p>Thank you for your purchase!</p>
          </div>
        </body>
      </html>
    `)
    printDocument.close()
    printWindow.print()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div ref={receiptRef}>
        <CardHeader className="text-center">
          <CardTitle>Receipt</CardTitle>
          <CardDescription>
            Order #{orderId} • {date.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between">
                <span>
                  {item.quantity} x {item.product.name}
                </span>
                <span>{formatCurrency(Number(item.product.price) * item.quantity)}</span>
              </div>
            ))}
            <Separator className="my-4" />
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
      </div>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button onClick={onClose}>Close</Button>
      </CardFooter>
    </Card>
  )
}
