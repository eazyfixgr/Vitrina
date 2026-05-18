'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { getSettings, updateSettings, uploadImage } from '@/lib/store'
import { Save, ImagePlus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

const layouts = [
  { id: 'classic', name: 'Classic', description: 'Κλασική διάταξη με grid προϊόντων' },
  { id: 'modern', name: 'Modern', description: 'Μοντέρνα διάταξη με hero section' },
  { id: 'grid', name: 'Grid', description: 'Masonry grid σαν Pinterest' },
]

export default function SettingsPage() {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState({ logo: false, hero: false })

  useEffect(() => {
    async function load() {
      try {
        const data = await getSettings()
        setForm(data)
      } catch (error) {
        toast.error('Σφάλμα φόρτωσης ρυθμίσεων')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleImageUpload = async (e, type) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(prev => ({ ...prev, [type]: true }))
    try {
      const url = await uploadImage(file)
      setForm(prev => ({ ...prev, [`${type}_image_url`]: url }))
      toast.success('Εικόνα ανέβηκε')
    } catch (error) {
      toast.error('Σφάλμα ανεβάσματος')
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateSettings(form)
      toast.success('Οι ρυθμίσεις αποθηκεύτηκαν')
    } catch (error) {
      toast.error('Σφάλμα αποθήκευσης')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!form) return null

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ρυθμίσεις Site</h1>
        <p className="text-gray-500 mt-1">Διαμορφώστε την εμφάνιση και τα στοιχεία του καταστήματός σας</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Βασικές Πληροφορίες</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Όνομα Καταστήματος</label>
              <input type="text" value={form.site_name || ''} onChange={e => setForm({...form, site_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Τηλέφωνο</label>
              <input type="text" value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Διεύθυνση</label>
              <input type="text" value={form.address || ''} onChange={e => setForm({...form, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Περιγραφή</label>
            <textarea value={form.site_description || ''} onChange={e => setForm({...form, site_description: e.target.value})} rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Layout Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Επιλογή Layout</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {layouts.map((layout) => (
              <button
                key={layout.id}
                type="button"
                onClick={() => setForm({...form, layout: layout.id})}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  form.layout === layout.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-full h-24 rounded-lg mb-3 ${
                  layout.id === 'classic' ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                  layout.id === 'modern' ? 'bg-gradient-to-br from-purple-100 to-purple-200' :
                  'bg-gradient-to-br from-green-100 to-green-200'
                }`}>
                  <div className="p-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3].map(i => (
                        <div key={i} className={`h-3 flex-1 rounded ${
                          layout.id === 'classic' ? 'bg-blue-400' :
                          layout.id === 'modern' ? 'bg-purple-400' : 'bg-green-400'
                        }`} />
                      ))}
                    </div>
                    <div className="flex gap-1">
                      {[1,2,3].map(i => (
                        <div key={i} className={`h-6 flex-1 rounded ${
                          layout.id === 'classic' ? 'bg-blue-300' :
                          layout.id === 'modern' ? 'bg-purple-300' : 'bg-green-300'
                        }`} />
                      ))}
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{layout.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{layout.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Χρώματα</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Κύριο Χρώμα</label>
              <div className="flex gap-2">
                <input type="color" value={form.primary_color || '#1e40af'} onChange={e => setForm({...form, primary_color: e.target.value})}
                  className="w-10 h-10 rounded cursor-pointer" />
                <input type="text" value={form.primary_color || '#1e40af'} onChange={e => setForm({...form, primary_color: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Δευτερεύον Χρώμα</label>
              <div className="flex gap-2">
                <input type="color" value={form.secondary_color || '#f59e0b'} onChange={e => setForm({...form, secondary_color: e.target.value})}
                  className="w-10 h-10 rounded cursor-pointer" />
                <input type="text" value={form.secondary_color || '#f59e0b'} onChange={e => setForm({...form, secondary_color: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
              </div>
            </div>
          </div>
        </div>

        {/* Logo & Hero Images */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Εικόνες</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Λογότυπο</label>
              {form.logo_url && (
                <div className="relative w-32 h-16 mb-2">
                  <Image src={form.logo_url} alt="Logo" fill className="object-contain" />
                  <button type="button" onClick={() => setForm({...form, logo_url: ''})}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full">
                    <X size={12} />
                  </button>
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                <ImagePlus size={20} className="text-gray-400" />
                <span className="text-sm text-gray-500">{uploading.logo ? 'Ανέβασμα...' : 'Ανέβασμα λογότυπου'}</span>
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'logo')} className="hidden" disabled={uploading.logo} />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Εικόνα Hero (για Modern layout)</label>
              {form.hero_image_url && (
                <div className="relative w-full h-24 mb-2">
                  <Image src={form.hero_image_url} alt="Hero" fill className="object-cover rounded-lg" />
                  <button type="button" onClick={() => setForm({...form, hero_image_url: ''})}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full">
                    <X size={12} />
                  </button>
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                <ImagePlus size={20} className="text-gray-400" />
                <span className="text-sm text-gray-500">{uploading.hero ? 'Ανέβασμα...' : 'Ανέβασμα εικόνας'}</span>
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'hero')} className="hidden" disabled={uploading.hero} />
              </label>
            </div>
          </div>
        </div>

        {/* Hero Text */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Τίτλος</label>
              <input type="text" value={form.hero_title || ''} onChange={e => setForm({...form, hero_title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Υπότιτλος</label>
              <input type="text" value={form.hero_subtitle || ''} onChange={e => setForm({...form, hero_subtitle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.show_hero || false} onChange={e => setForm({...form, show_hero: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-gray-700">Εμφάνιση Hero section στην αρχική</span>
            </label>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input type="url" value={form.facebook_url || ''} onChange={e => setForm({...form, facebook_url: e.target.value})}
                placeholder="https://facebook.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input type="url" value={form.instagram_url || ''} onChange={e => setForm({...form, instagram_url: e.target.value})}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Αποθήκευση...' : 'Αποθήκευση Ρυθμίσεων'}
          </button>
        </div>
      </form>
    </div>
  )
}
