import { getProducts } from "@/lib/data/actions"
//import { getMainProductImage } from "@/lib/image-service"
import { ProductCard } from "@/app/landingpage/components/product-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, LayoutDashboard } from "lucide-react"

export default async function ProductsCatalogPage() {
  const products = await getProducts()

  // Get main images for all products
  const productsWithImages = await Promise.all(
    products.map(async (product) => {
      //const { image } = await getMainProductImage(product.id)
      const image = product.image
      return {
        product,
        mainImage: image,
      }
    }),
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Product Catalog</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/landingpage">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link href="/landingpage">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productsWithImages.length > 0 ? (
            productsWithImages.map(({ product, mainImage }) => (
              <ProductCard key={product.id} product={product}  />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} POS System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
