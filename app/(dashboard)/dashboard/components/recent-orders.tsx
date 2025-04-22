import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Order } from "@/lib/data/schema"
import { users } from "@/lib/data/mock"

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="space-y-8">
      {orders.map((order) => {
        const customer = users.find((user) => user.id === order.customerId)
        if (!customer) return null

        return (
          <div key={order.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                {customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{customer.name}</p>
              <p className="text-sm text-muted-foreground">{order.createdAt.toLocaleDateString()}</p>
            </div>
            <div className="ml-auto font-medium">+${Number(order.total).toFixed(2)}</div>
          </div>
        )
      })}
    </div>
  )
}
