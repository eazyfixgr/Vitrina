const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only import and create real client if env vars are set
const isConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl.startsWith('http') && 
  supabaseUrl !== 'your_supabase_url_here'

let supabase

if (isConfigured) {
  const { createClient } = require('@supabase/supabase-js')
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // Mock client for development/build without Supabase
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }),
      order: () => Promise.resolve({ data: [], error: null }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        remove: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      }),
    },
  }
}

export { supabase }
