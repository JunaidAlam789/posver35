import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

interface TestimonialCardProps {
  name: string
  role: string
  content: string
  rating: number
  image: string
}

export function TestimonialCard({ name, role, content, rating, image }: TestimonialCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
          ))}
        </div>
        <p className="text-gray-600 dark:text-gray-300 flex-grow mb-4">{content}</p>
        <div className="flex items-center mt-auto pt-4 border-t">
          <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
            <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" sizes="40px" />
          </div>
          <div>
            <h4 className="font-medium">{name}</h4>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

