import { supabase } from '@/lib/supabase'
import { getSettings, getCategories, getProducts } from '@/lib/store'
import SiteLayout from '@/components/SiteLayout'
import ClassicLayout from '@/components/layouts/ClassicLayout'
import ModernLayout from '@/components/layouts/ModernLayout'
import GridLayout from '@/components/layouts/GridLayout'

export const dynamic = 'force-dynamic'

const layoutComponents = {
  classic: ClassicLayout,
  modern: ModernLayout,
  grid: GridLayout,
}

export default async function HomePage() {
  let settings = null
  let categories = []
  let products = []

  try {
    settings = await getSettings()
    categories = await getCategories()
    products = await getProducts()
  } catch (error) {
    console.error('Error loading data:', error)
  }

  const LayoutComponent = layoutComponents[settings?.layout] || ClassicLayout

  return (
    <SiteLayout settings={settings} categories={categories}>
      <LayoutComponent
        products={products}
        categories={categories}
        settings={settings}
      />
    </SiteLayout>
  )
}
