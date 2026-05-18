'use client'

export const dynamic = 'force-dynamic'

import { AuthProvider } from '@/lib/auth'
import AdminLayout from '@/components/admin/AdminLayout'
import { usePathname } from 'next/navigation'

export default function AdminRootLayout({ children }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  // Don't wrap login page with AdminLayout (which requires auth)
  if (isLoginPage) {
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    )
  }

  return (
    <AuthProvider>
      <AdminLayout>{children}</AdminLayout>
    </AuthProvider>
  )
}
