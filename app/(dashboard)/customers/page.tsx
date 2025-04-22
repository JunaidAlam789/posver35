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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4 md:pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Customers</h2>
      </div>
      <div className="overflow-x-auto">
        <DataTable data={customers.filter((user) => user.role === "CUSTOMER")} columns={columns} />
      </div>
    </div>
  )
}
