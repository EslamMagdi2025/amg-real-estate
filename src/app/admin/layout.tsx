'use client'

import type { Metadata } from "next";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [adminSession, setAdminSession] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuthentication();
  }, [pathname]); // إضافة pathname كـ dependency

  useEffect(() => {
    // تحديد الصفحة الحالية بناء على الـ pathname
    if (pathname === '/admin') {
      setCurrentPage('dashboard');
    } else if (pathname === '/admin/users') {
      setCurrentPage('users');
    } else if (pathname === '/admin/properties/review') {
      setCurrentPage('properties-review');
    } else if (pathname === '/admin/portfolio') {
      setCurrentPage('portfolio');
    } else if (pathname === '/admin/projects') {
      setCurrentPage('projects');
    } else if (pathname === '/admin/inquiries') {
      setCurrentPage('inquiries');
    } else if (pathname === '/admin/reports') {
      setCurrentPage('reports');
    } else if (pathname === '/admin/admins') {
      setCurrentPage('admins');
    } else if (pathname === '/admin/settings') {
      setCurrentPage('settings');
    } else if (pathname.includes('/admin/')) {
      const parts = pathname.split('/');
      setCurrentPage(parts[parts.length - 1]);
    }
  }, [pathname]);

  // Debug logging for admin session changes (simplified)
  useEffect(() => {
    console.log('AdminLayout - Page:', currentPage, 'Role:', adminSession?.role)
  }, [currentPage, adminSession]);

  const checkAuthentication = () => {
    // إذا كان المستخدم في صفحة تسجيل الدخول، لا نحتاج للتحقق من التوثيق
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    const session = localStorage.getItem('amg_admin_session');
    
    if (!session) {
      router.push('/admin/login');
      return;
    }

    try {
      const sessionData = JSON.parse(session);
      setAdminSession(sessionData.admin || sessionData); // Support both formats
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Invalid session data:', error);
      localStorage.removeItem('amg_admin_session');
      router.push('/admin/login');
    }
    setLoading(false);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // إذا كان المستخدم في صفحة تسجيل الدخول، عرض الصفحة بدون sidebar
  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // سيتم إعادة التوجيه إلى صفحة تسجيل الدخول
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar 
        currentPage={currentPage}
        onPageChange={handlePageChange}
        adminRole={adminSession?.role || 'MODERATOR'}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:mr-[280px] min-h-screen">
        {/* Top Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="text-right">
                <h1 className="text-xl font-bold text-gray-900">
                  مرحباً، {adminSession?.name || 'الإدارة'}
                </h1>
                <p className="text-sm text-gray-500">
                  {adminSession?.role === 'SUPER_ADMIN' ? 'مدير عام' : 'مشرف'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 space-x-reverse">
              <button
                onClick={() => {
                  localStorage.removeItem('amg_admin_session');
                  router.push('/admin/login');
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                تسجيل خروج
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
