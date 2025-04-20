import { getProducts, getCategories } from "@/lib/data/actions"
//import { getMainProductImage } from "@/lib/image-service"
import { ProductCard } from "./components/product-card"
import { CategoryCard } from "./components/category-card"
import { TestimonialCard } from "./components/testimonial-card"
import { NewsletterForm } from "./components/newsletter-form"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingBag, Truck, CreditCard, LifeBuoy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function LandingPage() {
  const products = await getProducts()
  const categories = await getCategories()

  // Get featured products (first 4)
  const featuredProducts = products.slice(0, 4)

  // Get main images for featured products
  const featuredProductsWithImages = await Promise.all(
    featuredProducts.map(async (product) => {
      //const { image } = await getMainProductImage(product.id)
      const image = product.image
      return {
        product,
        mainImage: image,
      }
    }),
  )

  // Get featured categories (first 3)
  const featuredCategories = categories.slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/hero-image.jpg" alt="Hero background" fill className="object-cover brightness-50" priority />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Modern Solutions for Your Business</h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Streamline your operations with our powerful point of sale system designed for businesses of all sizes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/products-catalog">
                Shop Now <ShoppingBag className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <Link href="/dashboard">Dashboard Access</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Easy Shopping</h3>
                <p className="text-muted-foreground">Browse and purchase products with a seamless experience.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Fast Delivery</h3>
                <p className="text-muted-foreground">Get your products delivered quickly and efficiently.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Secure Payments</h3>
                <p className="text-muted-foreground">Your transactions are protected with advanced security.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <LifeBuoy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">24/7 Support</h3>
                <p className="text-muted-foreground">Our team is always available to help with any issues.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button asChild variant="ghost">
              <Link href="/products-catalog">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProductsWithImages.map(({ product, mainImage }) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src="/about-image.jpg"
                alt="About our company"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">About Our Company</h2>
              <p className="text-muted-foreground mb-6">
                We are dedicated to providing the best point of sale solutions for businesses of all sizes. Our system
                is designed to streamline your operations, improve customer experience, and boost your bottom line.
              </p>
              <p className="text-muted-foreground mb-6">
                With years of experience in the industry, we understand the challenges businesses face and have
                developed a solution that addresses these pain points effectively.
              </p>
              <Button asChild>
                <Link href="/dashboard">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              name="Sarah Johnson"
              role="Retail Store Owner"
              image="/testimonials/person1.jpg"
              content="This POS system has transformed how we operate. The inventory management is seamless, and the reporting features give me insights I never had before."
              rating={5}
            />
            <TestimonialCard
              name="Michael Chen"
              role="Restaurant Manager"
              image="/testimonials/person2.jpg"
              content="The speed and reliability of this system have significantly improved our customer service. Our staff picked it up quickly, and we've seen a boost in sales."
              rating={4}
            />
            <TestimonialCard
              name="Emily Rodriguez"
              role="Boutique Owner"
              image="/testimonials/person3.jpg"
              content="The customer support is outstanding. Whenever we've had questions, the team has been responsive and helpful. I highly recommend this POS solution."
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-primary/5 rounded-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-4 text-center">Stay Updated</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
              Subscribe to our newsletter to receive updates, news, and exclusive offers directly to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  )
}
