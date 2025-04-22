import { listProductImages } from "@/lib/blob"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

export default async function ImagesPage() {
  const { blobs, error } = await listProductImages()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Product Images</h2>
      </div>

      {error ? (
        <div className="bg-destructive/15 p-4 rounded-md text-destructive">Error loading images: {error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {blobs && blobs.length > 0 ? (
            blobs.map((blob) => (
              <Card key={blob.url}>
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={blob.url || "/placeholder.svg"}
                    alt={blob.pathname}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="text-sm truncate">{blob.pathname}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(blob.uploadedAt), { addSuffix: true })}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center p-12">
              <p className="text-muted-foreground">No images found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
