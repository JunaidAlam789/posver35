import { getProduct, getCategories } from "@/lib/data/actions"
import { ProductForm } from "../../components/product-form"
import { notFound } from "next/navigation"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const [product, categories] = await Promise.all([getProduct(params.id), getCategories()])

  if (!product) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  )
}

