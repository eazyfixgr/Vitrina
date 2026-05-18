'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function GridLayout({ products, categories, settings }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Compact Categories */}
      {categories?.length > 0 && (
        <div className="mb-12 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            <Link
              href="/"
              className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium"
            >
              Όλα
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="flex-shrink-0 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Masonry-like Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {products?.map((product, index) => {
          // Vary heights for masonry effect
          const isTall = index % 3 === 0
          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group break-inside-avoid block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className={`relative ${isTall ? 'aspect-[3/4]' : 'aspect-square'} bg-gray-50`}>
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {/* Quick info overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  {product.price && (
                    <p className="text-white font-bold text-lg">{product.price}€</p>
                  )}
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-400 mb-0.5">{product.code}</p>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
              </div>
            </Link>
          )
        })}
      </div>

      {(!products || products.length === 0) && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">Δεν υπάρχουν προϊόντα ακόμα.</p>
        </div>
      )}
    </div>
  )
}
