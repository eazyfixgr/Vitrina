'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { getProducts, deleteProduct, getCategories, createProduct, updateProduct, uploadImage } from '@/lib/store'
import { Plus, Pencil, Trash2, Search, X, ImagePlus } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({
    name: '',
    code: '',
    price: '',
    description: '',
    category_id: '',
    images: [],
    features: '',
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ])
        if (mounted) {
          setProducts(productsData || [])
          setCategories(categoriesData || [])
        }
      } catch (error) {
        if (mounted) toast.error('Σφάλμα φόρτωσης προϊόντων')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.code?.toLowerCase().includes(search.toLowerCase())
  )

  const resetForm = () => {
    setForm({ name: '', code: '', price: '', description: '', category_id: '', images: [], features: '' })
    setEditingProduct(null)
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setForm({
      name: product.name || '',
      code: product.code || '',
      price: product.price?.toString() || '',
      description: product.description || '',
      category_id: product.category_id?.toString() || '',
      images: product.images || [],
      features: product.features || '',
    })
    setShowModal(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImage(file)
      setForm(prev => ({ ...prev, images: [...prev.images, url] }))
      toast.success('Εικόνα ανέβηκε')
    } catch (error) {
      toast.error('Σφάλμα ανεβάσματος εικόνας')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.code) {
      toast.error('Συμπληρώστε όνομα και κωδικό')
      return
    }

    try {
      const productData = {
        name: form.name,
        code: form.code,
        price: form.price ? parseFloat(form.price) : null,
        description: form.description,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        images: form.images,
        features: form.features,
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
        toast.success('Προϊόν ενημερώθηκε')
      } else {
        await createProduct(productData)
        toast.success('Προϊόν δημιουργήθηκε')
      }

      setShowModal(false)
      resetForm()
      // Reload products
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ])
      setProducts(productsData || [])
      setCategories(categoriesData || [])
    } catch (error) {
      toast.error('Σφάλμα αποθήκευσης')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Είστε σίγουροι;')) return
    try {
      await deleteProduct(id)
      toast.success('Προϊόν διαγράφηκε')
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ])
      setProducts(productsData || [])
      setCategories(categoriesData || [])
    } catch (error) {
      toast.error('Σφάλμα διαγραφής')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Προϊόντα</h1>
          <p className="text-gray-500">{products.length} προϊόντα συνολικά</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Νέο Προϊόν
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Αναζήτηση προϊόντων..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Εικόνα</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Κωδικός</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Όνομα</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Κατηγορία</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Τιμή</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Ενέργειες</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt="" width={48} height={48} className="w-12 h-12 object-cover rounded-lg" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                        <ImagePlus size={20} />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{product.code}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{product.categories?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm font-medium">{product.price ? `${product.price}€` : '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    Δεν βρέθηκαν προϊόντα
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Επεξεργασία Προϊόντος' : 'Νέο Προϊόν'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Όνομα *</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Κωδικός *</label>
                  <input type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Τιμή (€)</label>
                  <input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Κατηγορία</label>
                  <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Χωρίς κατηγορία</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Περιγραφή</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Χαρακτηριστικά</label>
                <textarea value={form.features} onChange={e => setForm({...form, features: e.target.value})} rows={2}
                  placeholder="Ένα ανά γραμμή"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Εικόνες</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map((url, index) => (
                    <div key={index} className="relative w-20 h-20">
                      <Image src={url} alt="" fill className="object-cover rounded-lg" />
                      <button type="button" onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <ImagePlus size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{uploading ? 'Ανέβασμα...' : 'Προσθήκη εικόνας'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  Ακύρωση
                </button>
                <button type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  {editingProduct ? 'Ενημέρωση' : 'Δημιουργία'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
