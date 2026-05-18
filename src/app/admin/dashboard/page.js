'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { getProducts, getCategories } from '@/lib/store'
import { Package, FolderTree, Eye, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, categories: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [products, categories] = await Promise.all([
          getProducts(),
          getCategories(),
        ])
        setStats({
          products: products?.length || 0,
          categories: categories?.length || 0,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const cards = [
    {
      title: 'Προϊόντα',
      value: stats.products,
      icon: Package,
      color: 'bg-blue-500',
      href: '/admin/products',
    },
    {
      title: 'Κατηγορίες',
      value: stats.categories,
      icon: FolderTree,
      color: 'bg-green-500',
      href: '/admin/categories',
    },
    {
      title: 'Προβολή Site',
      value: 'Live',
      icon: Eye,
      color: 'bg-purple-500',
      href: '/',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Καλώς ήρθατε στο Vitrina CMS</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? (
                    <span className="inline-block w-8 h-8 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    card.value
                  )}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="text-white" size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Γρήγορες Ενέργειες</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/products"
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Package className="text-blue-600" size={24} />
            <div>
              <p className="font-medium text-blue-900">Προσθήκη Προϊόντος</p>
              <p className="text-sm text-blue-600">Προσθέστε νέα προϊόντα στη βιτρίνα</p>
            </div>
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FolderTree className="text-green-600" size={24} />
            <div>
              <p className="font-medium text-green-900">Διαχείριση Κατηγοριών</p>
              <p className="text-sm text-green-600">Οργανώστε τα προϊόντα σε κατηγορίες</p>
            </div>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <TrendingUp className="text-purple-600" size={24} />
            <div>
              <p className="font-medium text-purple-900">Ρυθμίσεις Site</p>
              <p className="text-sm text-purple-600">Αλλάξτε χρώματα, λογότυπο και layout</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
