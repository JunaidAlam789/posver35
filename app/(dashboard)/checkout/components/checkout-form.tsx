"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CartSummary } from "./cart-summary"
import { ProductSelector } from "./product-selector"
import { useCart } from "@/lib/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Receipt } from "@/components/receipt"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

const checkoutFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  zipCode: z.string().min(5, { message: "Zip code must be at least 5 characters." }),
  paymentMethod: z.enum(["credit_card", "paypal", "cash"], {
    required_error: "Please select a payment method.",
  }),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  notes: z.string().optional(),
})

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>

export function CheckoutForm() {
  const { items, subtotal, tax, total, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [orderDate, setOrderDate] = useState<Date>(new Date())

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      paymentMethod: "credit_card",
      notes: "",
    },
  })

  const paymentMethod = form.watch("paymentMethod")

  async function onSubmit(data: CheckoutFormValues) {
    if (items.length === 0) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a random order ID
      const newOrderId = Math.random().toString(36).substring(2, 10).toUpperCase()
      setOrderId(newOrderId)
      setOrderDate(new Date())
      setShowReceipt(true)
      clearCart()
    } catch (error) {
      console.error("Error processing checkout:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder="10001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="credit_card"
                          value="credit_card"
                          checked={field.value === "credit_card"}
                          onChange={() => field.onChange("credit_card")}
                          className="h-4 w-4"
                        />
                        <label htmlFor="credit_card">Credit Card</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="paypal"
                          value="paypal"
                          checked={field.value === "paypal"}
                          onChange={() => field.onChange("paypal")}
                          className="h-4 w-4"
                        />
                        <label htmlFor="paypal">PayPal</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="cash"
                          value="cash"
                          checked={field.value === "cash"}
                          onChange={() => field.onChange("cash")}
                          className="h-4 w-4"
                        />
                        <label htmlFor="cash">Cash on Delivery</label>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {paymentMethod === "credit_card" && (
                <div className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input placeholder="4242 4242 4242 4242" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cardExpiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cardCvc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVC</FormLabel>
                          <FormControl>
                            <Input placeholder="123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Products</CardTitle>
              <CardDescription>Search and add products to your cart</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductSelector />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special instructions for your order"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <CartSummary />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={isSubmitting || items.length === 0}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Order"
            )}
          </Button>
        </form>
      </Form>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="sm:max-w-md">
          <Receipt
            items={items}
            subtotal={subtotal}
            tax={tax}
            total={total}
            orderId={orderId}
            date={orderDate}
            onClose={() => setShowReceipt(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
