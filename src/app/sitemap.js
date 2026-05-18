import { getCategories, getProducts } from '@/lib/store'

export const dynamic = 'force-dynamic'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vitrina.gr'

  try {
    const [categories, products] = await Promise.all([
      getCategories(),
      getProducts(),
    ])

    const categoryUrls = (categories || []).map((cat) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: cat.updated_at || new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    const productUrls = (products || []).map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: product.updated_at || new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

    return [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      ...categoryUrls,
      ...productUrls,
    ]
  } catch (error) {
    // Fallback if Supabase is not configured yet
    return [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
    ]
  }
}
