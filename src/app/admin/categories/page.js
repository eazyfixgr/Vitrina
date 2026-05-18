'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory, uploadImage } from '@/lib/store'
import { Plus, Pencil, Trash2, X, ImagePlus } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [form, setForm] = useState({ name: '', slug: '', description: '', image_url: '' })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const data = await getCategories()
        if (mounted) setCategories(data || [])
      } catch (error) {
        if (mounted) toast.error('Σφάλμα φόρτωσης κατηγοριών')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const resetForm = () => {
    setForm({ name: '', slug: '', description: '', image_url: '' })
    setEditingCategory(null)
  }

  const openEdit = (cat) => {
    setEditingCategory(cat)
    setForm({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      image_url: cat.image_url || '',
    })
    setShowModal(true)
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setForm(prev => ({ ...prev, image_url: url }))
      toast.success('Εικόνα ανέβηκε')
    } catch (error) {
      toast.error('Σφάλμα ανεβάσματος')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name) {
      toast.error('Συμπληρώστε όνομα κατηγορίας')
      return
    }

    try {
      const catData = {
        name: form.name,
        slug: form.slug || generateSlug(form.name),
        description: form.description,
        image_url: form.image_url,
        sort_order: categories.length,
      }

      if (editingCategory) {
        await updateCategory(editingCategory.id, catData)
        toast.success('Κατηγορία ενημερώθηκε')
      } else {
        await createCategory(catData)
        toast.success('Κατηγορία δημιουργήθηκε')
      }

      setShowModal(false)
      resetForm()
      // Reload categories
      const data = await getCategories()
      setCategories(data || [])
    } catch (error) {
      toast.error('Σφάλμα αποθήκευσης')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Είστε σίγουροι;')) return
    try {
      await deleteCategory(id)
      toast.success('Κατηγορία διαγράφηκε')
      const data = await getCategories()
      setCategories(data || [])
    } catch (error) {
      toast.error('Σφάλμα διαγραφής')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Κατηγορίες</h1>
          <p className="text-gray-500">{categories.length} κατηγορίες</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={20} />
          Νέα Κατηγορία
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-start gap-4">
              {cat.image_url ? (
                <Image src={cat.image_url} alt={cat.name} width={64} height={64} className="w-16 h-16 object-cover rounded-lg" />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                  <ImagePlus size={24} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{cat.name}</h3>
                <p className="text-sm text-gray-500 truncate">{cat.slug}</p>
                {cat.description && (
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{cat.description}</p>
                )}
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {categories.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Δεν υπάρχουν κατηγορίες ακόμα
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">
                {editingCategory ? 'Επεξεργασία Κατηγορίας' : 'Νέα Κατηγορία'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Όνομα *</label>
                <input type="text" value={form.name} onChange={e => {
                  const name = e.target.value
                  setForm(prev => ({
                    ...prev,
                    name,
                    slug: editingCategory ? prev.slug : generateSlug(name)
                  }))
                }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                <input type="text" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Περιγραφή</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Εικόνα</label>
                {form.image_url && (
                  <div className="relative w-24 h-24 mb-2">
                    <Image src={form.image_url} alt="" fill className="object-cover rounded-lg" />
                    <button type="button" onClick={() => setForm({...form, image_url: ''})}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full">
                      <X size={12} />
                    </button>
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500">
                  <ImagePlus size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{uploading ? 'Ανέβασμα...' : 'Επιλογή εικόνας'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Ακύρωση</button>
                <button type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  {editingCategory ? 'Ενημέρωση' : 'Δημιουργία'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
