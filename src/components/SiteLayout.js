'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Search, Menu, X, Phone, Mail, MapPin } from 'lucide-react'

export default function SiteLayout({ children, settings, categories }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const primaryColor = settings?.primary_color || '#1e40af'
  const secondaryColor = settings?.secondary_color || '#f59e0b'

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              {settings?.logo_url ? (
                <Image
                  src={settings.logo_url}
                  alt={settings.site_name || 'Logo'}
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <span className="text-xl font-bold" style={{ color: primaryColor }}>
                  {settings?.site_name || 'Το Κατάστημά μου'}
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Αρχική
              </Link>
              {categories?.slice(0, 5).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  {cat.name}
                </Link>
              ))}
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Επικοινωνία
              </Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Search size={20} />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Αναζήτηση προϊόντων..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-72 bg-white shadow-xl">
            <div className="p-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900 float-right"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="px-4 space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
              >
                Αρχική
              </Link>
              {categories?.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
              >
                Επικοινωνία
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Info */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                {settings?.site_name || 'Το Κατάστημά μου'}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {settings?.site_description}
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Επικοινωνία</h3>
              <div className="space-y-3">
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <Phone size={16} />
                    <span>{settings.phone}</span>
                  </a>
                )}
                {settings?.email && (
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <Mail size={16} />
                    <span>{settings.email}</span>
                  </a>
                )}
                {settings?.address && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={16} />
                    <span>{settings.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Ακολουθήστε μας</h3>
              <div className="flex gap-4">
                {settings?.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    Facebook
                  </a>
                )}
                {settings?.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    Instagram
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {settings?.site_name || 'Το Κατάστημά μου'}. Με επιφύλαξη παντός δικαιώματος.
          </div>
        </div>
      </footer>
    </div>
  )
}
