import { getProduct, getSettings, getCategories } from '@/lib/store'
import SiteLayout from '@/components/SiteLayout'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Phone, ArrowLeft } from 'lucide-react'

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params
    const product = await getProduct(resolvedParams.id)
    if (!product) return {}
    return {
      title: product.name,
      description: product.description || `${product.name} - Κωδικός: ${product.code}`,
      openGraph: {
        title: product.name,
        description: product.description || `${product.name} - Κωδικός: ${product.code}`,
        images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function ProductPage({ params }) {
  let product, settings, categories

  try {
    const resolvedParams = await params
    product = await getProduct(resolvedParams.id)
    settings = await getSettings()
    categories = await getCategories()
  } catch (error) {
    notFound()
  }

  if (!product) notFound()

  const features = product.features
    ? product.features.split('\n').filter(f => f.trim())
    : []

  return (
    <SiteLayout settings={settings} categories={categories}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Πίσω</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-50">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border-2 border-transparent hover:border-blue-500 cursor-pointer transition-colors"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.categories && (
              <Link
                href={`/categories/${product.categories.slug}`}
                className="inline-block text-sm text-blue-600 hover:text-blue-800 mb-2"
              >
                {product.categories.name}
              </Link>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-lg text-gray-500 font-mono mb-6">Κωδικός: {product.code}</p>

            {product.price && (
              <p className="text-4xl font-bold text-blue-600 mb-8">{product.price}€</p>
            )}

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Περιγραφή</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Χαρακτηριστικά</h2>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Call to Action */}
            {settings?.phone && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Ενδιαφέρεστε για αυτό το προϊόν;</h3>
                <p className="text-gray-600 mb-4">
                  Καλέστε μας για να το παραγγείλετε ή για περισσότερες πληροφορίες.
                </p>
                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
                >
                  <Phone size={20} />
                  {settings.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
