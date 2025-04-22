"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Order } from "@/lib/data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { users } from "@/lib/data/mock"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { updateOrderStatus } from "@/lib/data/actions"

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
    cell: ({ row }) => {
      return <div className="font-medium">#{row.getValue("id")}</div>
    },
  },
  {
    accessorKey: "customerId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => {
      const customer = users.find((user) => user.id === row.getValue("customerId"))
      return <div>{customer?.name}</div>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as Order["status"]
      return (
        <Badge
          variant={
            status === "COMPLETED"
              ? "success"
              : status === "PENDING"
                ? "warning"
                : status === "PROCESSING"
                  ? "default"
                  : status === "CANCELLED"
                    ? "destructive"
                    : "secondary"
          }
        >
          {status.toLowerCase()}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("total"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div>{date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original

      return (
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
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(order.id)
              }}
            >
              Copy order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "PROCESSING")}>
              Mark as processing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "COMPLETED")}>
              Mark as completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "CANCELLED")}>Cancel order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
