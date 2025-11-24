import Hero from '@/components/home/Hero'
import Outlets from '@/components/home/Outlets'
import ProductPreview from '@/components/home/ProductPreview'
import Events from '@/components/home/Events'
import { PublicLayout } from '@/components/layout/PublicLayout'

export default function Home() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-background text-foreground">
        <Hero />
        <Outlets />
        <ProductPreview />
        <Events />
      </div>
    </PublicLayout>
  )
}
