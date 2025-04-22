import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import type { Category } from "@/lib/data/schema"

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  // Generate a random pastel color for the category card
  const colors = [
    "bg-blue-100 dark:bg-blue-900",
    "bg-green-100 dark:bg-green-900",
    "bg-purple-100 dark:bg-purple-900",
    "bg-pink-100 dark:bg-pink-900",
    "bg-yellow-100 dark:bg-yellow-900",
    "bg-indigo-100 dark:bg-indigo-900",
    "bg-red-100 dark:bg-red-900",
    "bg-orange-100 dark:bg-orange-900",
  ]

  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  return (
    <Link href={`/dashboard?category=${category.id}`}>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md h-full">
        <CardContent className={`p-6 flex flex-col items-center justify-center text-center h-full ${randomColor}`}>
          <h3 className="font-medium text-xl mb-2">{category.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{category.description}</p>
          <div className="flex items-center text-sm font-medium">
            Shop Now <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
