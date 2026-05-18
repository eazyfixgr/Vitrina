import { supabase } from './supabase'

// ============ CATEGORIES ============
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data
}

export async function getCategory(slug) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

export async function createCategory(category) {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCategory(id, updates) {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCategory(id) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ============ PRODUCTS ============
export async function getProducts(categoryId = null) {
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)')
    .order('created_at', { ascending: false })
  
  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ============ SETTINGS ============
export async function getSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data || getDefaultSettings()
}

export async function updateSettings(updates) {
  const { data, error } = await supabase
    .from('settings')
    .upsert([{ id: 1, ...updates }])
    .select()
    .single()
  if (error) throw error
  return data
}

function getDefaultSettings() {
  return {
    id: 1,
    site_name: 'Το Κατάστημά μου',
    site_description: 'Καλώς ήρθατε στο κατάστημά μας',
    logo_url: null,
    primary_color: '#1e40af',
    secondary_color: '#f59e0b',
    layout: 'classic',
    phone: '',
    email: '',
    address: '',
    hero_title: 'Καλώς ήρθατε',
    hero_subtitle: 'Ανακαλύψτε τα προϊόντα μας',
    hero_image_url: null,
    show_hero: true,
    show_categories_on_home: true,
    facebook_url: '',
    instagram_url: '',
  }
}

// ============ IMAGES ============
export async function uploadImage(file, bucket = 'images') {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return publicUrl
}

export async function deleteImage(url) {
  const path = url.split('/').pop()
  const { error } = await supabase.storage
    .from('images')
    .remove([path])
  if (error) throw error
}
