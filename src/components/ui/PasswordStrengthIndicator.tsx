'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid'

interface PasswordStrength {
  score: number
  feedback: string[]
  isValid: boolean
  requirements: {
    minLength: boolean
    hasUppercase: boolean
    hasLowercase: boolean
    hasNumbers: boolean
    hasSymbols: boolean
    noCommonPatterns: boolean
  }
}

interface PasswordStrengthIndicatorProps {
  password: string
  onStrengthChange?: (strength: PasswordStrength) => void
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  onStrengthChange
}) => {
  const [strength, setStrength] = useState<PasswordStrength | null>(null)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (!password) {
      setStrength(null)
      onStrengthChange?.(null as any)
      return
    }

    const checkStrength = async () => {
      setChecking(true)
      try {
        const response = await fetch('/api/user/check-password-strength', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setStrength(data.data)
            onStrengthChange?.(data.data)
          }
        }
      } catch (error) {
        console.error('Error checking password strength:', error)
      } finally {
        setChecking(false)
      }
    }

    const debounceTimer = setTimeout(checkStrength, 500)
    return () => clearTimeout(debounceTimer)
  }, [password, onStrengthChange])

  if (!password || !strength) return null

  const getStrengthLabel = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return 'ضعيف جداً'
      case 2:
        return 'ضعيف'
      case 3:
        return 'متوسط'
      case 4:
        return 'قوي'
      default:
        return 'غير محدد'
    }
  }

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return 'bg-red-500'
      case 2:
        return 'bg-orange-500'
      case 3:
        return 'bg-yellow-500'
      case 4:
        return 'bg-green-500'
      default:
        return 'bg-gray-300'
    }
  }

  const requirements = [
    { key: 'minLength', label: '8 أحرف على الأقل', met: strength.requirements.minLength },
    { key: 'hasUppercase', label: 'حرف كبير (A-Z)', met: strength.requirements.hasUppercase },
    { key: 'hasLowercase', label: 'حرف صغير (a-z)', met: strength.requirements.hasLowercase },
    { key: 'hasNumbers', label: 'رقم (0-9)', met: strength.requirements.hasNumbers },
    { key: 'hasSymbols', label: 'رمز خاص (!@#$)', met: strength.requirements.hasSymbols },
    { key: 'noCommonPatterns', label: 'تجنب الأنماط الشائعة', met: strength.requirements.noCommonPatterns }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 p-4 bg-gray-50 rounded-lg border"
    >
      {/* مؤشر القوة */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">قوة كلمة المرور</span>
          <span className={`text-sm font-medium ${
            strength.score >= 3 ? 'text-green-600' : 
            strength.score >= 2 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {getStrengthLabel(strength.score)}
          </span>
        </div>
        
        {/* شريط التقدم */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(strength.score / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
            className={`h-2 rounded-full ${getStrengthColor(strength.score)}`}
          />
        </div>
      </div>

      {/* المتطلبات */}
      <div className="space-y-2">
        {requirements.map((req, index) => (
          <motion.div
            key={req.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2"
          >
            {req.met ? (
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
            ) : (
              <XCircleIcon className="w-4 h-4 text-gray-400" />
            )}
            <span className={`text-xs ${req.met ? 'text-green-700' : 'text-gray-600'}`}>
              {req.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* الملاحظات */}
      {strength.feedback.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          {strength.feedback.map((feedback, index) => (
            <div key={index} className="flex items-start gap-2 mb-1">
              <ShieldCheckIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-gray-600">{feedback}</span>
            </div>
          ))}
        </div>
      )}

      {checking && (
        <div className="flex items-center gap-2 mt-2">
          <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-500"></div>
          <span className="text-xs text-gray-500">جاري فحص قوة كلمة المرور...</span>
        </div>
      )}
    </motion.div>
  )
}

export default PasswordStrengthIndicator