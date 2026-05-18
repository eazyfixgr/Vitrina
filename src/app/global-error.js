'use client'

export const dynamic = 'force-dynamic'

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
            <p className="text-xl text-gray-600 mb-8">Κάτι πήγε στραβά</p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Δοκιμάστε ξανά
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
