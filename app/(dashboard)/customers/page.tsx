import { getUsers } from "@/lib/data/actions"
import { DataTable } from "./components/data-table"
import { columns } from "./components/columns"

export const metadata = {
  title: "Customers",
  description: "Manage your customers",
}

export default async function CustomersPage() {
  const customers = await getUsers()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
      </div>
      <DataTable data={customers.filter((user) => user.role === "CUSTOMER")} columns={columns} />
    </div>
  )
}

