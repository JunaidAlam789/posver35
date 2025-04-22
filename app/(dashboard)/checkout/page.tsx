"use client"

import { CheckoutForm } from "./components/checkout-form"

export default function CheckoutPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4 md:pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Checkout</h2>
      </div>
      <div className="grid gap-4">
        <div className="w-full">
          <CheckoutForm />
        </div>
      </div>
    </div>
  )
}
