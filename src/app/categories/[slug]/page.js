import { getCategory, getProducts, getSettings, getCategories } from '@/lib/store'
import SiteLayout from '@/components/SiteLayout'
import ClassicLayout from '@/components/layouts/ClassicLayout'
import ModernLayout from '@/components/layouts/ModernLayout'
import GridLayout from '@/components/layouts/GridLayout'
import { notFound } from 'next/navigation'

const layoutComponents = {
  classic: ClassicLayout,
  modern: ModernLayout,
  grid: GridLayout,
}

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params
    const category = await getCategory(resolvedParams.slug)
    if (!category) return {}
    return {
      title: category.name,
      description: category.description || `Προϊόντα στην κατηγορία ${category.name}`,
      openGraph: {
        title: category.name,
        description: category.description || `Προϊόντα στην κατηγορία ${category.name}`,
        images: category.image_url ? [{ url: category.image_url }] : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function CategoryPage({ params }) {
  let category, products, settings, allCategories

  try {
    const resolvedParams = await params
    category = await getCategory(resolvedParams.slug)
    settings = await getSettings()
    allCategories = await getCategories()
    products = await getProducts(category.id)
  } catch (error) {
    notFound()
  }

  if (!category) notFound()

  const LayoutComponent = layoutComponents[settings?.layout] || ClassicLayout

  return (
    <SiteLayout settings={settings} categories={allCategories}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600 mt-2">{category.description}</p>
          )}
        </div>
      </div>
      <LayoutComponent
        products={products}
        categories={allCategories}
        settings={settings}
      />
    </SiteLayout>
  )
}
