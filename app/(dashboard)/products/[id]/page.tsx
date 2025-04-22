import { getProduct } from "@/lib/data/actions"
import { notFound } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4 md:pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{product.name}</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild className="w-full md:w-auto">
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
          <Button asChild className="w-full md:w-auto">
            <Link href={`/products/${product.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
          <Image
            src={product.image || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Price</h3>
                <p className="text-xl md:text-2xl font-bold">{formatCurrency(Number(product.price))}</p>
              </div>
              <div>
                <h3 className="font-medium">SKU</h3>
                <p>{product.sku}</p>
              </div>
              <div>
                <h3 className="font-medium">Category</h3>
                <p>{product.category?.name || "Uncategorized"}</p>
              </div>
              <div>
                <h3 className="font-medium">Stock</h3>
                <Badge variant={product.stock > 10 ? "default" : "destructive"}>{product.stock} in stock</Badge>
              </div>
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-muted-foreground">{product.description || "No description available."}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
