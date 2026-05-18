'use client'

export const dynamic = 'force-dynamic'

import { AuthProvider } from '@/lib/auth'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminRootLayout({ children }) {
  return (
    <AuthProvider>
      <AdminLayout>{children}</AdminLayout>
    </AuthProvider>
  )
}
