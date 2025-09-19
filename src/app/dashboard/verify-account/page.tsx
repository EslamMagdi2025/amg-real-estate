'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { motion } from 'framer-motion'
import { 
  EnvelopeIcon, 
  CheckCircleIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon,
  HomeIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function AccountVerificationPage() {
  const { user } = useAuth()
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [resendCount, setResendCount] = useState(0)

  // إذا كان المستخدم مؤكد بالفعل
  if (user?.verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md"
        >
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            حسابك مؤكد بالفعل! ✅
          </h1>
          <p className="text-gray-600 mb-6">
            تم توثيق بريدك الإلكتروني بنجاح ويمكنك استخدام جميع ميزات الموقع.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            العودة للداشبورد
          </Link>
        </motion.div>
      </div>
    )
  }

  const handleResendEmail = async () => {
    if (isResending || resendCount >= 3 || !user?.email) return

    setIsResending(true)
    setResendMessage('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email })
      })

      const result = await response.json()

      if (response.ok) {
        setResendMessage('✅ تم إرسال إيميل التوثيق بنجاح!')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          {/* أيقونة التحذير */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6"
          >
            <ExclamationTriangleIcon className="w-10 h-10 text-amber-600" />
          </motion.div>

          {/* العنوان */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            حسابك يحتاج توثيق 🔐
          </motion.h1>

          {/* النص التوضيحي */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-6 space-y-3"
          >
            <p>
              لاستخدام جميع ميزات الموقع، يرجى توثيق بريدك الإلكتروني:
            </p>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="font-medium text-blue-800 break-all">
                {user?.email}
              </p>
            </div>
            <p className="text-sm">
              سنرسل لك رابط تفعيل لتأكيد ملكيتك للبريد الإلكتروني.
            </p>
          </motion.div>

          {/* الفوائد */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200"
          >
            <div className="text-sm text-green-800">
              <p className="font-medium mb-2">مزايا توثيق الحساب:</p>
              <ul className="space-y-1 text-xs list-disc list-inside">
                <li>إضافة وإدارة العقارات</li>
                <li>التفاعل مع الإعلانات</li>
                <li>الحصول على إشعارات مهمة</li>
                <li>حماية أكبر لحسابك</li>
              </ul>
            </div>
          </motion.div>

          {/* زر إرسال التوثيق */}
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
                <>
                  <EnvelopeIcon className="w-5 h-5 ml-2" />
                  {resendCount === 0 ? 'إرسال إيميل التوثيق' : `إعادة الإرسال (${resendCount}/3)`}
                </>
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
              لم تجد الإيميل؟ تحقق من مجلد الـ Spam
            </div>
            <Link
              href="/dashboard"
              className="inline-block text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
            >
              العودة للداشبورد
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
            <EnvelopeIcon className="w-5 h-5 text-blue-500 inline ml-2" />
            سيتم إرسال رابط التفعيل خلال دقائق قليلة
          </div>
        </motion.div>
      </div>
    </div>
  )
}