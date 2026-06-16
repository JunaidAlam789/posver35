"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import type { Table } from "@tanstack/react-table"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { categories } from "@/lib/data/mock"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const stockStatusOptions = [
  { label: "In Stock", value: "in-stock" },
  { label: "Low Stock", value: "low-stock" },
  { label: "Out of Stock", value: "out-of-stock" },
]

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const isFiltered = table.getState().columnFilters.length > 0

  const handlePriceFilter = () => {
    const min = minPrice ? parseFloat(minPrice) : null
    const max = maxPrice ? parseFloat(maxPrice) : null
    table.getColumn("price")?.setFilterValue({ min, max })
  }

  const handleStockStatusChange = (value: string[]) => {
    table.getColumn("stockStatus")?.setFilterValue(value.length > 0 ? value : undefined)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="h-8 w-[150px] lg:w-[180px]"
          />
          <Input
            placeholder="Filter by SKU..."
            value={(table.getColumn("sku")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("sku")?.setFilterValue(event.target.value)}
            className="h-8 w-[150px] lg:w-[180px]"
          />
          {table.getColumn("categoryId") && (
            <DataTableFacetedFilter
              column={table.getColumn("categoryId")}
              title="Category"
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          )}
          {table.getColumn("stockStatus") && (
            <DataTableFacetedFilter
              column={table.getColumn("stockStatus")}
              title="Stock"
              options={stockStatusOptions}
            />
          )}
          {isFiltered && (
            <Button variant="ghost" onClick={() => {
              table.resetColumnFilters()
              setMinPrice("")
              setMaxPrice("")
            }} className="h-8 px-2 lg:px-3">
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Min Price</label>
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-8 w-24"
            step="0.01"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Max Price</label>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-8 w-24"
            step="0.01"
          />
        </div>
        <Button onClick={handlePriceFilter} variant="outline" className="h-8">
          Apply Price
        </Button>
      </div>
    </div>
  )
}
