"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import type { Product } from "@/lib/data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Edit, MoreHorizontal, Trash, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { DeleteProductDialog } from "./delete-product-dialog"

// Helper function to determine stock status
function getStockStatus(stock: number): "in-stock" | "low-stock" | "out-of-stock" {
  if (stock <= 0) return "out-of-stock"
  if (stock <= 20) return "low-stock"
  return "in-stock"
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Product" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-muted">
            <Image
              src={row.original.image || "/placeholder.svg?height=50&width=50"}
              alt={row.getValue("name")}
              className="object-cover"
              width={50}
              height={50}
              loading="lazy"
            />
          </div>
          <div className="flex flex-col">
            <div className="font-medium">{row.getValue("name")}</div>
            <div className="text-sm text-muted-foreground">{row.original.sku}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "sku",
    header: ({ column }) => <DataTableColumnHeader column={column} title="SKU" />,
    enableHiding: true,
  },
  {
    accessorKey: "categoryId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => {
      const category = row.original.category
      return <div>{category?.name || "Uncategorized"}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("price"))
      return <div className="font-medium">{formatCurrency(amount)}</div>
    },
    filterFn: (row, id, value) => {
      if (!value || (!value.min && !value.max)) return true
      const price = Number.parseFloat(row.getValue(id))
      if (value.min && price < value.min) return false
      if (value.max && price > value.max) return false
      return true
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
    cell: ({ row }) => {
      const stock = Number.parseInt(row.getValue("stock"))
      const status = getStockStatus(stock)
      const badgeVariant = status === "in-stock" ? "default" : status === "low-stock" ? "warning" : "destructive"
      return <Badge variant={badgeVariant}>{stock} in stock</Badge>
    },
  },
  {
    accessorKey: "stockStatus",
    header: "Stock Status",
    cell: ({ row }) => {
      const stock = Number.parseInt(row.original.stock)
      const status = getStockStatus(stock)
      const statusLabel = status === "in-stock" ? "In Stock" : status === "low-stock" ? "Low Stock" : "Out of Stock"
      return <div className="text-sm">{statusLabel}</div>
    },
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true
      const stock = Number.parseInt(row.original.stock)
      const status = getStockStatus(stock)
      return value.includes(status)
    },
    enableColumnFilter: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original
      const [showDeleteDialog, setShowDeleteDialog] = useState(false)

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/products/${product.id}`} className="flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/products/${product.id}/edit`} className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteProductDialog
            productId={product.id}
            productName={product.name}
            isOpen={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
          />
        </>
      )
    },
  },
]
