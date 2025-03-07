import { getProducts } from "@/lib/data/actions"
import { DataTable } from "./components/data-table"
import { columns } from "./components/columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ImportProducts } from "./components/import-products"
import { DownloadTemplate } from "./components/download-template"

export const metadata = {
  title: "Products",
  description: "Manage your products inventory",
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
          <DownloadTemplate />
          <ImportProducts />
          <Button asChild>
            <Link href="/products/new">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
      </div>
      <DataTable data={products} columns={columns} />
    </div>
  )
}

