'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  EnvelopeIcon, 
  CheckCircleIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function CheckEmailPage() {
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [resendCount, setResendCount] = useState(0)
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email')

  // إذا لم يكن هناك إيميل في الرابط، ارجع للتسجيل
  useEffect(() => {
    if (!email) {
      router.push('/auth/register')
    }
  }, [email, router])

  const handleResendEmail = async () => {
    if (isResending || resendCount >= 3) return

    setIsResending(true)
    setResendMessage('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const result = await response.json()

      if (response.ok) {
        setResendMessage('✅ تم إرسال الإيميل مرة أخرى بنجاح!')
        setResendCount(prev => prev + 1)
      } else {
        setResendMessage(`❌ ${result.message}`)
      }
    } catch (error) {
      setResendMessage('❌ حدث خطأ في إرسال الإيميل')
    } finally {
      setIsResending(false)
    }
  }

  if (!email) {
    return <div>جاري التحميل...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          {/* أيقونة الإيميل */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6"
          >
            <EnvelopeIcon className="w-10 h-10 text-blue-600" />
          </motion.div>

          {/* العنوان */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            تحقق من بريدك الإلكتروني 📧
          </motion.h1>

          {/* النص التوضيحي */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-6 space-y-3"
          >
            <p>
              تم إرسال رابط تفعيل الحساب إلى:
            </p>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="font-medium text-blue-800 break-all">
                {email}
              </p>
            </div>
            <p className="text-sm">
              اضغط على الرابط في الإيميل لتفعيل حسابك والوصول إلى جميع الميزات.
            </p>
          </motion.div>

          {/* تعليمات */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-amber-50 rounded-lg p-4 mb-6 border border-amber-200"
          >
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mt-0.5 ml-2 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">لم تجد الإيميل؟</p>
                <ul className="space-y-1 text-xs">
                  <li>• تحقق من مجلد الـ Spam أو الرسائل الغير مرغوب فيها</li>
                  <li>• تأكد من كتابة الإيميل بشكل صحيح</li>
                  <li>• قد يستغرق الأمر بضع دقائق للوصول</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* زر إعادة الإرسال */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <button
              onClick={handleResendEmail}
              disabled={isResending || resendCount >= 3}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isResending ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin ml-2" />
                  جاري الإرسال...
                </>
              ) : resendCount >= 3 ? (
                'تم استنفاد المحاولات'
              ) : (
                `إعادة إرسال الإيميل ${resendCount > 0 ? `(${resendCount}/3)` : ''}`
              )}
            </button>

            {resendMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-3 rounded-lg text-sm ${
                  resendMessage.includes('✅') 
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {resendMessage}
              </motion.div>
            )}
          </motion.div>

          {/* روابط إضافية */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 pt-6 border-t border-gray-200 space-y-3"
          >
            <div className="text-sm text-gray-500">
              هل تريد تغيير الإيميل؟
            </div>
            <Link
              href="/auth/register"
              className="inline-block text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
            >
              العودة للتسجيل
            </Link>
          </motion.div>
        </motion.div>

        {/* معلومات إضافية */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <div className="bg-white rounded-lg shadow p-4 text-sm text-gray-600">
            <CheckCircleIcon className="w-5 h-5 text-green-500 inline ml-2" />
            سيتم تفعيل حسابك فور الضغط على رابط التفعيل
          </div>
        </motion.div>
      </div>
    </div>
  )
}