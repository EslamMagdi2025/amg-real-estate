'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  QrCodeIcon,
  ShieldCheckIcon,
  KeyIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { 
  ShieldCheckIcon as ShieldCheckIconSolid 
} from '@heroicons/react/24/solid'

interface TwoFactorSetupProps {
  isEnabled: boolean
  onStatusChange: (enabled: boolean) => void
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ isEnabled, onStatusChange }) => {
  const [step, setStep] = useState<'start' | 'setup' | 'verify' | 'disable'>('start')
  const [loading, setLoading] = useState(false)
  const [setupData, setSetupData] = useState<any>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [showBackupCodes, setShowBackupCodes] = useState(false)

  // بدء تفعيل المصادقة الثنائية
  const startSetup = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/2fa', {
        method: 'POST',
        credentials: 'include'
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        setSetupData(data.data)
        setBackupCodes(data.data.backupCodes)
        setStep('setup')
      } else {
        alert(data.message || 'فشل في إنشاء المصادقة الثنائية')
      }
    } catch (error) {
      console.error('Error starting 2FA setup:', error)
      alert('حدث خطأ في إعداد المصادقة الثنائية')
    } finally {
      setLoading(false)
    }
  }

  // تأكيد تفعيل المصادقة الثنائية
  const verifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      alert('أدخل رمز التحقق المكون من 6 أرقام')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/user/2fa', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ verificationCode })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        alert('تم تفعيل المصادقة الثنائية بنجاح!')
        onStatusChange(true)
        setShowBackupCodes(true)
        setStep('start')
        setVerificationCode('')
        setSetupData(null)
      } else {
        alert(data.message || 'رمز التحقق غير صحيح')
      }
    } catch (error) {
      console.error('Error verifying 2FA:', error)
      alert('حدث خطأ في التحقق من الرمز')
    } finally {
      setLoading(false)
    }
  }

  // إلغاء تفعيل المصادقة الثنائية
  const disableTwoFactor = async () => {
    if (!password) {
      alert('أدخل كلمة المرور لإلغاء تفعيل المصادقة الثنائية')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/user/2fa', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          password,
          verificationCode: verificationCode || undefined
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        alert('تم إلغاء تفعيل المصادقة الثنائية')
        onStatusChange(false)
        setStep('start')
        setPassword('')
        setVerificationCode('')
      } else {
        alert(data.message || 'فشل في إلغاء تفعيل المصادقة الثنائية')
      }
    } catch (error) {
      console.error('Error disabling 2FA:', error)
      alert('حدث خطأ في إلغاء تفعيل المصادقة الثنائية')
    } finally {
      setLoading(false)
    }
  }

  // نسخ النص
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('تم النسخ!')
  }

  return (
    <div className="space-y-6">
      {/* حالة المصادقة الثنائية */}
      <div className={`p-4 rounded-xl border-2 ${
        isEnabled 
          ? 'bg-green-50 border-green-200' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isEnabled ? (
              <ShieldCheckIconSolid className="w-6 h-6 text-green-600" />
            ) : (
              <ShieldCheckIcon className="w-6 h-6 text-gray-500" />
            )}
            <div>
              <h3 className="font-medium text-gray-900">المصادقة الثنائية (2FA)</h3>
              <p className={`text-sm ${isEnabled ? 'text-green-700' : 'text-gray-600'}`}>
                {isEnabled ? 'مفعلة وتحمي حسابك' : 'غير مفعلة'}
              </p>
            </div>
          </div>
          
          {isEnabled ? (
            <button
              onClick={() => setStep('disable')}
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              إلغاء التفعيل
            </button>
          ) : (
            <button
              onClick={startSetup}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'جاري الإعداد...' : 'تفعيل'}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* خطوة الإعداد */}
        {step === 'setup' && setupData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-gray-200 rounded-xl p-6"
          >
            <div className="text-center mb-6">
              <QrCodeIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                إعداد المصادقة الثنائية
              </h3>
              <p className="text-sm text-gray-600">
                امسح رمز QR أو أدخل المفتاح السري في تطبيق المصادقة
              </p>
            </div>

            {/* QR Code */}
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-xl">
                <img 
                  src={setupData.qrCode} 
                  alt="QR Code" 
                  className="w-48 h-48 mx-auto"
                />
              </div>
            </div>

            {/* المفتاح السري */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المفتاح السري (للإدخال اليدوي)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={setupData.secret}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={() => copyToClipboard(setupData.secret)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <DocumentDuplicateIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* التعليمات */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">التعليمات:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                {setupData.setupInstructions.map((instruction: string, index: number) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>

            {/* رمز التحقق */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                أدخل رمز التحقق من التطبيق
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={6}
              />
            </div>

            {/* أزرار التحكم */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep('start')
                  setSetupData(null)
                  setVerificationCode('')
                }}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={verifyAndEnable}
                disabled={!verificationCode || verificationCode.length !== 6 || loading}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري التحقق...' : 'تأكيد التفعيل'}
              </button>
            </div>
          </motion.div>
        )}

        {/* خطوة إلغاء التفعيل */}
        {step === 'disable' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-red-200 rounded-xl p-6"
          >
            <div className="text-center mb-6">
              <ExclamationTriangleIcon className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                إلغاء تفعيل المصادقة الثنائية
              </h3>
              <p className="text-sm text-gray-600">
                سيؤدي هذا إلى تقليل أمان حسابك. أدخل كلمة المرور للمتابعة.
              </p>
            </div>

            {/* كلمة المرور */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* رمز التحقق (اختياري) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز التحقق من تطبيق المصادقة (اختياري)
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={6}
              />
            </div>

            {/* أزرار التحكم */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep('start')
                  setPassword('')
                  setVerificationCode('')
                }}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={disableTwoFactor}
                disabled={!password || loading}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري الإلغاء...' : 'إلغاء التفعيل'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* الكودات الاحتياطية */}
      {showBackupCodes && backupCodes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <KeyIcon className="w-5 h-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-900">الكودات الاحتياطية</h4>
            </div>
            <button
              onClick={() => setShowBackupCodes(false)}
              className="text-yellow-600 hover:text-yellow-700"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-sm text-yellow-800 mb-4">
            احفظ هذه الكودات في مكان آمن. يمكنك استخدامها للوصول لحسابك إذا فقدت جهازك.
          </p>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            {backupCodes.map((code, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                <span className="flex-1 font-mono text-sm">{code}</span>
                <button
                  onClick={() => copyToClipboard(code)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <DocumentDuplicateIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => copyToClipboard(backupCodes.join('\n'))}
            className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm transition-colors"
          >
            نسخ جميع الكودات
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default TwoFactorSetup