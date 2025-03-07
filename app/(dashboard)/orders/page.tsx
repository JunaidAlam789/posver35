import { getOrders } from "@/lib/data/actions"
import { DataTable } from "./components/data-table"
import { columns } from "./components/columns"

export const metadata = {
  title: "Orders",
  description: "Manage your orders",
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      </div>
      <DataTable data={orders} columns={columns} />
    </div>
  )
}

