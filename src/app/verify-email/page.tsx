'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/AuthContext'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const { refreshUser } = useAuth()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setStatus('error')
      setMessage('رمز التحقق غير صحيح')
    }
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken })
      })

      const result = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('تم تفعيل البريد الإلكتروني بنجاح!')
        
        // تحديث بيانات المستخدم في AuthContext
        await refreshUser()
        
        // توجيه للداشبورد بعد 2 ثانية
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setStatus('error')
        setMessage(result.message || 'حدث خطأ أثناء التفعيل')
      }
    } catch (error) {
      setStatus('error')
      setMessage('حدث خطأ في الاتصال')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-md text-center"
        >
          {status === 'loading' && (
            <>
              <ArrowPathIcon className="h-16 w-16 mx-auto text-blue-600 animate-spin mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                جاري تفعيل البريد الإلكتروني...
              </h2>
              <p className="text-gray-600">
                يرجى الانتظار بينما نقوم بتفعيل حسابك
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircleIcon className="h-16 w-16 mx-auto text-green-600 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                تم التفعيل بنجاح!
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                الذهاب إلى لوحة التحكم
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircleIcon className="h-16 w-16 mx-auto text-red-600 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                فشل في التفعيل
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                العودة إلى لوحة التحكم
              </button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}