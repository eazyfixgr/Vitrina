'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function ModernLayout({ products, categories, settings }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      {settings?.show_hero && (
        <div className="relative mb-16 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="relative z-10 px-8 py-16 md:py-24 md:px-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {settings.hero_title || 'Καλώς ήρθατε'}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl">
              {settings.hero_subtitle || 'Ανακαλύψτε τα προϊόντα μας'}
            </p>
          </div>
          {settings.hero_image_url && (
            <div className="absolute inset-0 opacity-20">
              <Image
                src={settings.hero_image_url}
                alt=""
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      )}

      {/* Categories as Cards */}
      {categories?.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Κατηγορίες</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group relative h-40 rounded-xl overflow-hidden bg-gray-100"
              >
                {cat.image_url && (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-xl font-bold drop-shadow-lg">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products - Modern Grid */}
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Προϊόντα</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products?.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <div className="aspect-[4/5] relative rounded-xl overflow-hidden bg-gray-50 mb-4">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{product.code}</p>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                {product.name}
              </h3>
              {product.price && (
                <p className="text-xl font-bold text-gray-900">{product.price}€</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {(!products || products.length === 0) && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">Δεν υπάρχουν προϊόντα ακόμα.</p>
        </div>
      )}
    </div>
  )
}
