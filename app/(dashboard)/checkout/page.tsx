"use client"

import { CheckoutForm } from "./components/checkout-form"

export default function CheckoutPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Checkout</h2>
      </div>
      <div className="grid gap-4">
        <div className="w-full">
          <CheckoutForm />
        </div>
      </div>
    </div>
  )
}

