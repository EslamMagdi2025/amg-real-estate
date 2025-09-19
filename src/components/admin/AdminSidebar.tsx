'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { 
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  CircleStackIcon,
  CogIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface AdminSidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  adminRole: string
}

export default function AdminSidebar({ currentPage, onPageChange, adminRole }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(1024) // Default to desktop width
  const router = useRouter()
  const pathname = usePathname()

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    // Set initial width
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth)
      window.addEventListener('resize', handleResize)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  // Auto-detect current page from URL
  useEffect(() => {
    const pathMap: { [key: string]: string } = {
      '/admin': 'dashboard',
      '/admin/users': 'users',
      '/admin/properties/review': 'properties-review',
      '/admin/projects': 'projects',
      '/admin/portfolio': 'portfolio',
      '/admin/inquiries': 'inquiries',
      '/admin/reports': 'reports',
      '/admin/admins': 'admins',
      '/admin/settings': 'settings'
    }

    const detectedPage = pathMap[pathname] || 'dashboard'
    if (detectedPage !== currentPage) {
      onPageChange(detectedPage)
    }
  }, [pathname, currentPage, onPageChange])

  const menuItems = [
    {
      id: 'dashboard',
      name: 'لوحة المعلومات',
      icon: HomeIcon,
      roles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT']
    },
    {
      id: 'users',
      name: 'إدارة المستخدمين',
      icon: UsersIcon,
      roles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR']
    },

    {
      id: 'properties-review',
      name: 'مراجعة العقارات',
      icon: ShieldCheckIcon,
      roles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR']
    },
    {
      id: 'projects',
      name: 'إدارة المشاريع',
      icon: ChartBarIcon,
      roles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR']
    },
    {
      id: 'portfolio',
      name: 'إدارة الأعمال',
      icon: DocumentTextIcon,
      roles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR']
    },
    {
      id: 'inquiries',
      name: 'الاستفسارات',
      icon: ChatBubbleLeftRightIcon,
      roles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT']
    },
    {
      id: 'database',
      name: 'قاعدة البيانات',
      icon: CircleStackIcon,
      roles: ['SUPER_ADMIN', 'ADMIN']
    },
    {
      id: 'reports',
      name: 'التقارير',
      icon: DocumentTextIcon,
      roles: ['SUPER_ADMIN', 'ADMIN']
    },
    {
      id: 'admins',
      name: 'إدارة المشرفين',
      icon: ShieldCheckIcon,
      roles: ['SUPER_ADMIN']
    },
    {
      id: 'settings',
      name: 'الإعدادات',
      icon: CogIcon,
      roles: ['SUPER_ADMIN', 'ADMIN']
    }
  ]

  const filteredMenuItems = menuItems.filter(item => 
    adminRole && item.roles.includes(adminRole as any)
  )

  // Debug logging (cleaned up)
  console.log('AdminSidebar Debug - adminRole:', adminRole, 'filteredMenuItems:', filteredMenuItems.length)

  // Handle navigation
  const handleNavigation = (itemId: string) => {
    // Map menu items to their routes
    const routeMap: { [key: string]: string } = {
      'dashboard': '/admin',
      'users': '/admin/users',
      'properties-review': '/admin/properties/review',
      'projects': '/admin/projects',
      'portfolio': '/admin/portfolio',
      'inquiries': '/admin/inquiries',
      'database': '/admin',
      'reports': '/admin/reports',
      'admins': '/admin/admins',
      'settings': '/admin/settings'
    }

    const route = routeMap[itemId] || '/admin'
    
    // Navigate to the route
    router.push(route)
    
    // Update the current page for highlighting
    onPageChange(itemId)
    
    // Close mobile menu
    setIsMobileOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border"
        >
          {isMobileOpen ? (
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          )}
        </motion.button>
      </div>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        style={{
          width: isCollapsed ? '80px' : '280px',
          transform: isMobileOpen ? 'translateX(0)' : (windowWidth < 1024 ? 'translateX(-280px)' : 'translateX(0)'),
          transition: 'all 0.3s ease'
        }}
        className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-xl z-40 ${
          isMobileOpen ? 'lg:relative' : 'hidden lg:block'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-3 space-x-reverse"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <ShieldCheckIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">AMG Admin</h2>
                    <p className="text-sm text-gray-500">لوحة التحكم</p>
                  </div>
                </motion.div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bars3Icon className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredMenuItems.map((item) => {
              const IconComponent = item.icon
              const isActive = currentPage === item.id
              
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </motion.button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <p className="text-xs text-gray-500 mb-2">AMG Real Estate</p>
                <p className="text-xs text-gray-400">Admin Panel v1.0</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
