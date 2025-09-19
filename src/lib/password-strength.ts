/**
 * Password Strength Utility
 * يوفر وظائف للتحقق من قوة كلمة المرور وتقييمها
 */

export interface PasswordStrength {
  score: number // 0-4 (0: ضعيف جداً، 4: قوي جداً)
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

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true
}

// كلمات المرور الشائعة التي يجب تجنبها
const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123',
  'password123', 'admin', 'letmein', 'welcome', 'monkey',
  'dragon', '12345678', '1234567890', 'iloveyou', 'princess',
  'superman', 'mustafa', 'mohamed', 'ahmed', 'hassan',
  '123456a', 'qwerty123', 'password1', 'admin123'
]

// أنماط شائعة يجب تجنبها
const COMMON_PATTERNS = [
  /^(.)\1{2,}$/, // تكرار نفس الحرف
  /^(012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210)/, // تسلسل رقمي
  /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/, // تسلسل أبجدي
  /^(qwe|wer|ert|rty|tyu|yui|uio|iop|asd|sdf|dfg|fgh|ghj|hjk|jkl|zxc|xcv|cvb|vbn|bnm)/, // تسلسل لوحة المفاتيح
]

export function checkPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = []
  let score = 0

  // التحقق من المتطلبات الأساسية
  const requirements = {
    minLength: password.length >= PASSWORD_REQUIREMENTS.minLength,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSymbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    noCommonPatterns: !isCommonPassword(password) && !hasCommonPatterns(password)
  }

  // فحص الطول
  if (!requirements.minLength) {
    feedback.push(`كلمة المرور يجب أن تكون ${PASSWORD_REQUIREMENTS.minLength} أحرف على الأقل`)
  } else {
    score += 1
  }

  // فحص الأحرف الكبيرة
  if (!requirements.hasUppercase) {
    feedback.push('يجب أن تحتوي على حرف كبير واحد على الأقل (A-Z)')
  } else {
    score += 1
  }

  // فحص الأحرف الصغيرة
  if (!requirements.hasLowercase) {
    feedback.push('يجب أن تحتوي على حرف صغير واحد على الأقل (a-z)')
  } else {
    score += 1
  }

  // فحص الأرقام
  if (!requirements.hasNumbers) {
    feedback.push('يجب أن تحتوي على رقم واحد على الأقل (0-9)')
  } else {
    score += 1
  }

  // فحص الرموز
  if (!requirements.hasSymbols) {
    feedback.push('يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%^&*)')
  } else {
    score += 1
  }

  // فحص الأنماط الشائعة
  if (!requirements.noCommonPatterns) {
    feedback.push('تجنب استخدام كلمات المرور الشائعة أو الأنماط المتكررة')
  }

  // تحسين النقاط بناءً على الطول
  if (password.length >= 12) {
    score += 1
  }
  if (password.length >= 16) {
    score += 1
  }

  // تحسين النقاط بناءً على التنوع
  const charSets = [
    /[a-z]/, /[A-Z]/, /[0-9]/, /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
  ].filter(regex => regex.test(password)).length

  if (charSets >= 3) {
    score += 1
  }

  // الحد الأقصى للنقاط
  score = Math.min(score, 4)

  // تحديد ما إذا كانت كلمة المرور صالحة
  const isValid = Object.values(requirements).every(req => req === true)

  // إضافة ملاحظات إيجابية
  if (feedback.length === 0) {
    if (score >= 4) {
      feedback.push('كلمة مرور قوية جداً! 🔒')
    } else if (score >= 3) {
      feedback.push('كلمة مرور جيدة، يمكن تحسينها أكثر')
    }
  }

  return {
    score,
    feedback,
    isValid,
    requirements
  }
}

function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.includes(password.toLowerCase())
}

function hasCommonPatterns(password: string): boolean {
  return COMMON_PATTERNS.some(pattern => pattern.test(password.toLowerCase()))
}

export function getPasswordStrengthLabel(score: number): string {
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

export function getPasswordStrengthColor(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return 'text-red-600 bg-red-50'
    case 2:
      return 'text-orange-600 bg-orange-50'
    case 3:
      return 'text-yellow-600 bg-yellow-50'
    case 4:
      return 'text-green-600 bg-green-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}