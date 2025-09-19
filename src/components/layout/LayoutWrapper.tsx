'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { WhatsAppButton } from '@/components/ui'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  
  // Check if it's an admin route or dashboard route
  const isAdminRoute = pathname?.startsWith('/admin')
  const isDashboardRoute = pathname?.startsWith('/dashboard')
  
  return (
    <>
      {isAdminRoute || isDashboardRoute ? (
        // Admin routes and Dashboard routes - بدون Header/Footer/LoadingScreen
        <main>{children}</main>
      ) : (
        // Regular website routes - مع Header/Footer
        <LoadingScreen minDuration={3000} showOnRefresh={true}>
          <Header key="main-header" />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton 
            phoneNumber="201234567890"
            message="مرحباً، أريد الاستفسار عن خدمات AMG العقارية"
          />
        </LoadingScreen>
      )}
    </>
  )
}