'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ShieldCheckIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  BellIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  CogIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  UserIcon,
  GlobeAltIcon,
  TrashIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { 
  CheckCircleIcon as CheckCircleIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid 
} from '@heroicons/react/24/solid'
import { useAuth, withAuth } from '@/lib/AuthContext'
import PasswordStrengthIndicator from '@/components/ui/PasswordStrengthIndicator'
import TwoFactorSetup from '@/components/ui/TwoFactorSetup'
import SessionManagement from '@/components/ui/SessionManagement'

interface SecuritySettings {
  emailVerified: boolean
  phoneVerified: boolean
  twoFactorEnabled: boolean
  loginNotifications: boolean
  securityAlerts: boolean
  sessionTimeout: number
  lastPasswordChange: string
  activeSessions: number
}

interface LoginSession {
  id: string
  device: string
  location: string
  ip: string
  lastActive: string
  current: boolean
}

function AccountSettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('security')

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    emailVerified: false,
    phoneVerified: false,
    twoFactorEnabled: false,
    loginNotifications: true,
    securityAlerts: true,
    sessionTimeout: 30,
    lastPasswordChange: '',
    activeSessions: 1
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [passwordStrength, setPasswordStrength] = useState<any>(null)

  const [activeSessions, setActiveSessions] = useState<LoginSession[]>([])

  // جلب إعدادات الأمان
  useEffect(() => {
    fetchSecuritySettings()
    fetchActiveSessions()
  }, [])

  const fetchSecuritySettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/security-settings', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSecuritySettings(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching security settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchActiveSessions = async () => {
    try {
      const response = await fetch('/api/user/sessions', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setActiveSessions(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    }
  }

  // إعادة إرسال رابط التوثيق
  const resendVerificationEmail = async () => {
    if (!user?.email) return;
    
    try {
      const response = await fetch(`/api/auth/verify-email?email=${encodeURIComponent(user.email)}`, {
        method: 'GET'
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ تم إرسال رابط التفعيل إلى بريدك الإلكتروني!');
      } else {
        alert('❌ ' + (data.message || 'حدث خطأ أثناء الإرسال'));
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      alert('❌ حدث خطأ أثناء إرسال الإيميل');
    }
  }

  // تغيير كلمة المرور
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('كلمات المرور غير متطابقة')
      return
    }

    if (!passwordStrength || !passwordStrength.isValid) {
      alert('كلمة المرور لا تلبي متطلبات الأمان')
      return
    }

    try {
      setSaving('password')
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        alert(`تم تغيير كلمة المرور بنجاح! قوة كلمة المرور: ${data.passwordStrength?.label}`)
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setPasswordStrength(null)
        fetchSecuritySettings()
      } else {
        if (data.feedback && data.feedback.length > 0) {
          alert(`فشل في تغيير كلمة المرور:\n${data.feedback.join('\n')}`)
        } else {
          alert(data.message || 'فشل في تغيير كلمة المرور')
        }
      }
    } catch (error) {
      console.error('Error changing password:', error)
      alert('حدث خطأ في تغيير كلمة المرور')
    } finally {
      setSaving('')
    }
  }

  // تفعيل المصادقة الثنائية
  const toggleTwoFactor = async () => {
    try {
      setSaving('2fa')
      const response = await fetch('/api/user/toggle-2fa', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSecuritySettings(prev => ({
            ...prev,
            twoFactorEnabled: !prev.twoFactorEnabled
          }))
        }
      }
    } catch (error) {
      console.error('Error toggling 2FA:', error)
    } finally {
      setSaving('')
    }
  }

  // تحديث إعدادات الإشعارات
  const updateNotificationSetting = async (setting: string, value: boolean) => {
    try {
      setSaving(setting)
      const response = await fetch('/api/user/notification-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ [setting]: value })
      })

      if (response.ok) {
        setSecuritySettings(prev => ({ ...prev, [setting]: value }))
      }
    } catch (error) {
      console.error('Error updating notification setting:', error)
    } finally {
      setSaving('')
    }
  }

  // إنهاء جلسة
  const terminateSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/user/sessions/${sessionId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        setActiveSessions(prev => prev.filter(session => session.id !== sessionId))
      }
    } catch (error) {
      console.error('Error terminating session:', error)
    }
  }

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    if (!dateString) return 'غير محدد'
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const tabs = [
    { id: 'security', label: 'الأمان', icon: ShieldCheckIcon },
    { id: 'password', label: 'كلمة المرور', icon: KeyIcon },
    { id: 'notifications', label: 'الإشعارات', icon: BellIcon },
    { id: 'sessions', label: 'الجلسات النشطة', icon: DevicePhoneMobileIcon }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      {loading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">جاري تحميل الإعدادات...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link 
                href="/dashboard" 
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  إعدادات الحساب والأمان
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  إدارة أمان حسابك وإعدادات الخصوصية
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.firstName?.charAt(0) || 'م'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الحساب</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-2 border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Security Overview */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <ShieldCheckIconSolid className="w-6 h-6 text-blue-600" />
                    نظرة عامة على الأمان
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className={`p-4 rounded-xl border-2 ${
                      securitySettings.emailVerified 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        <EnvelopeIcon className={`w-6 h-6 ${
                          securitySettings.emailVerified ? 'text-green-600' : 'text-yellow-600'
                        }`} />
                        <span className="font-medium">البريد الإلكتروني</span>
                      </div>
                      <p className={`text-sm ${
                        securitySettings.emailVerified ? 'text-green-700' : 'text-yellow-700'
                      }`}>
                        {securitySettings.emailVerified ? 'تم التحقق' : 'يتطلب تحقق'}
                      </p>
                    </div>

                    <div className={`p-4 rounded-xl border-2 ${
                      securitySettings.phoneVerified 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        <DevicePhoneMobileIcon className={`w-6 h-6 ${
                          securitySettings.phoneVerified ? 'text-green-600' : 'text-yellow-600'
                        }`} />
                        <span className="font-medium">رقم الهاتف</span>
                      </div>
                      <p className={`text-sm ${
                        securitySettings.phoneVerified ? 'text-green-700' : 'text-yellow-700'
                      }`}>
                        {securitySettings.phoneVerified ? 'تم التحقق' : 'يتطلب تحقق'}
                      </p>
                    </div>
                  </div>

                  {/* Two Factor Authentication */}
                  <TwoFactorSetup
                    isEnabled={securitySettings.twoFactorEnabled}
                    onStatusChange={(enabled) => setSecuritySettings(prev => ({
                      ...prev,
                      twoFactorEnabled: enabled
                    }))}
                  />
                </div>

                {/* Security Recommendations */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">توصيات الأمان</h2>
                  <div className="space-y-3">
                    {!securitySettings.emailVerified && (
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-yellow-800">تحقق من بريدك الإلكتروني</p>
                          <p className="text-xs text-yellow-700 mb-2">لحماية حسابك بشكل أفضل واكتساب 10 نقاط ثقة</p>
                          <button
                            onClick={resendVerificationEmail}
                            className="text-xs bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700 transition-colors"
                          >
                            📧 إعادة إرسال رابط التفعيل
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {!securitySettings.twoFactorEnabled && (
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <LockClosedIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">فعّل المصادقة الثنائية</p>
                          <p className="text-xs text-blue-700">لحماية إضافية لحسابك</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <KeyIcon className="w-6 h-6 text-blue-600" />
                  تغيير كلمة المرور
                </h2>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      كلمة المرور الحالية
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      كلمة المرور الجديدة
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* مؤشر قوة كلمة المرور */}
                  {passwordData.newPassword && (
                    <PasswordStrengthIndicator
                      password={passwordData.newPassword}
                      onStrengthChange={setPasswordStrength}
                    />
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تأكيد كلمة المرور الجديدة
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    disabled={saving === 'password' || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || !passwordStrength?.isValid}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving === 'password' ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                  </button>
                </div>

                {securitySettings.lastPasswordChange && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      آخر تغيير لكلمة المرور: {formatDate(securitySettings.lastPasswordChange)}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BellIcon className="w-6 h-6 text-blue-600" />
                  إعدادات الإشعارات
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">إشعارات تسجيل الدخول</h3>
                      <p className="text-sm text-gray-600">إشعار عند تسجيل الدخول من جهاز جديد</p>
                    </div>
                    <button
                      onClick={() => updateNotificationSetting('loginNotifications', !securitySettings.loginNotifications)}
                      disabled={saving === 'loginNotifications'}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        securitySettings.loginNotifications ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        securitySettings.loginNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">تنبيهات الأمان</h3>
                      <p className="text-sm text-gray-600">إشعار عند اكتشاف نشاط مشبوه</p>
                    </div>
                    <button
                      onClick={() => updateNotificationSetting('securityAlerts', !securitySettings.securityAlerts)}
                      disabled={saving === 'securityAlerts'}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        securitySettings.securityAlerts ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        securitySettings.securityAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SessionManagement />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(AccountSettingsPage)