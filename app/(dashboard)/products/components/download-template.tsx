"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function DownloadTemplate() {
  const handleDownload = () => {
    // CSV header and sample row
    const csvContent = [
      "name,description,price,sku,stock,categoryId,image",
      "Sample Product,This is a sample product description,19.99,PROD-001,100,1,https://example.com/image.jpg",
    ].join("\n")

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "product_import_template.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button variant="outline" onClick={handleDownload}>
      <Download className="mr-2 h-4 w-4" />
      Download Template
    </Button>
  )
}

