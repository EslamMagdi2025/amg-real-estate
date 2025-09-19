'use client'

// ======================================================
// 🔐 AMG Real Estate - Authentication Context
// ======================================================
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

// تعريف أنواع البيانات
interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
  userType: string
  verified: boolean
  emailVerified: boolean
  createdAt: string
}

interface UserStats {
  totalProperties: number
  activeProperties: number
  favoriteProperties: number
  totalInquiries: number
}

interface AuthContextType {
  user: User | null
  stats: UserStats | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ 
    success: boolean; 
    message: string;
    requires2FA?: boolean;
    tempToken?: string;
  }>
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  userType?: string
}

// إنشاء Context
const AuthContext = createContext<AuthContextType | null>(null)

// Hook لاستخدام Context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // دالة لجلب بيانات المستخدم الحالي
  const fetchUser = useCallback(async () => {
    try {
      console.log('🔍 AuthContext: Fetching user data...')
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('📡 AuthContext: API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ AuthContext: API response data:', data)
        if (data.success) {
          console.log('🎉 AuthContext: User authenticated:', data.user.email)
          setUser(data.user)
          setStats(data.stats)
        } else {
          console.log('❌ AuthContext: API returned success=false')
          setUser(null)
          setStats(null)
        }
      } else if (response.status === 401 || response.status === 404) {
        // 401 أو 404 طبيعي عندما لا يكون المستخدم مسجل دخول
        console.log('🚫 AuthContext: User not authenticated (401/404)')
        setUser(null)
        setStats(null)
      } else {
        // خطأ غير متوقع
        console.error(`❌ AuthContext: Unexpected error fetching user: ${response.status} ${response.statusText}`)
        setUser(null)
        setStats(null)
      }
    } catch (error) {
      // خطأ في الشبكة أو تحليل JSON
      console.error('Network or parsing error fetching user:', error)
      setUser(null)
      setStats(null)
    }
  }, [])

  // تسجيل الدخول
  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe })
      })

      const data = await response.json()

      if (data.success) {
        // إذا كان يطلب 2FA، لا تحدث المستخدم بعد
        if (data.requires2FA) {
          return { 
            success: true, 
            message: data.message,
            requires2FA: true,
            tempToken: data.tempToken
          }
        }
        
        // تسجيل دخول عادي
        setUser(data.user)
        // جلب الإحصائيات
        await fetchUser()
      }

      return { 
        success: data.success, 
        message: data.message,
        requires2FA: data.requires2FA,
        tempToken: data.tempToken
      }
    } catch (error) {
      console.error('Login error:', error instanceof Error ? error.message : error)
      return { 
        success: false, 
        message: error instanceof Error && error.message.includes('network') 
          ? 'مشكلة في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى'
          : 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى' 
      }
    }
  }

  // التسجيل
  const register = async (data: RegisterData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        setUser(result.user)
        // جلب الإحصائيات
        await fetchUser()
      }

      return { success: result.success, message: result.message }
    } catch (error) {
      console.error('Register error:', error instanceof Error ? error.message : error)
      return { 
        success: false, 
        message: error instanceof Error && error.message.includes('network')
          ? 'مشكلة في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى'
          : 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى'
      }
    }
  }

  // تسجيل الخروج
  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      
      // لا نحتاج لمعالجة النتيجة، فقط تسجيل الأخطاء الحقيقية
      if (!response.ok && response.status !== 401) {
        console.warn(`Logout warning: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      // تسجيل أخطاء الشبكة فقط
      if (error instanceof Error && error.message.includes('network')) {
        console.error('Network error during logout:', error.message)
      }
    } finally {
      // دائماً نظف الحالة المحلية
      setUser(null)
      setStats(null)
    }
  }

  // تحديث بيانات المستخدم
  const refreshUser = async () => {
    await fetchUser()
  }

  // جلب بيانات المستخدم عند تحميل الصفحة
  useEffect(() => {
    let isMounted = true
    
    const initAuth = async () => {
      setIsLoading(true)
      
      // تحقق من وجود المكون قبل تحديث الحالة
      if (isMounted) {
        await fetchUser()
        setIsLoading(false)
      }
    }

    initAuth()
    
    // تنظيف: منع تحديث الحالة إذا تم إلغاء تحميل المكون
    return () => {
      isMounted = false
    }
  }, [fetchUser])

  const value: AuthContextType = {
    user,
    stats,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// HOC لحماية الصفحات
export function withAuth<T extends Record<string, any>>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      )
    }

    if (!isAuthenticated) {
      // إعادة توجيه لصفحة تسجيل الدخول
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
      return null
    }

    return <Component {...props} />
  }
}