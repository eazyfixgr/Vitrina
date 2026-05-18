'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function ClassicLayout({ products, categories, settings }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Categories */}
      {categories?.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Κατηγορίες</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
          >
            <div className="aspect-square relative bg-gray-50">
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
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1">{product.code}</p>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                {product.name}
              </h3>
              {product.price && (
                <p className="text-lg font-bold text-blue-600">{product.price}€</p>
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
