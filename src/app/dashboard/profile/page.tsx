'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
  CameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  HomeIcon,
  ChevronRightIcon,
  UserCircleIcon,
  ArrowLeftIcon,
  CogIcon,
  BellIcon,
  EyeIcon,
  StarIcon,
  TrophyIcon,
  ChartBarIcon,
  SparklesIcon,
  GlobeAltIcon,
  ClockIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline'
import { 
  CheckCircleIcon as CheckCircleIconSolid,
  StarIcon as StarIconSolid 
} from '@heroicons/react/24/solid'
import { useAuth, withAuth } from '@/lib/AuthContext'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  userType: string
  verified: boolean
  emailVerified: boolean
  phoneVerified: boolean
  createdAt: string
  avatar?: string
  bio?: string
  company?: string
  membership?: {
    level: string
    levelData: {
      description: string
      icon: string
      color: string
      benefits: string[]
    }
    experience: string
    experienceData: {
      description: string
      icon: string
      color: string
    }
    trustScore: number
    progress: {
      nextLevel: string | null
      progress: number
      requirements: string[]
    }
  }
  website?: string
  location?: string
}

interface ProfileStats {
  propertiesCount: number
  viewsCount: number
  favoritesCount: number
  rating: number | null
  reviewsCount: number
  joinDate: string
}

function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userType: 'INDIVIDUAL',
    verified: false,
    emailVerified: false,
    phoneVerified: false,
    createdAt: '',
    bio: '',
    company: '',
    website: '',
    location: ''
  })

  const [stats, setStats] = useState<ProfileStats>({
    propertiesCount: 0,
    viewsCount: 0,
    favoritesCount: 0,
    rating: null,
    reviewsCount: 0,
    joinDate: ''
  })

  const [recentActivity, setRecentActivity] = useState<any[]>([])

  // تحديث بيانات الملف الشخصي من المستخدم
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        userType: user.userType || 'INDIVIDUAL',
        verified: user.verified || false,
        emailVerified: (user as any).emailVerified || false,
        phoneVerified: (user as any).phoneVerified || false,
        createdAt: user.createdAt || '',
        avatar: user.avatar,
        bio: (user as any).bio || '',
        company: (user as any).company || '',
        website: (user as any).website || '',
        location: (user as any).location || ''
      })
      // جلب الإحصائيات
      fetchUserStats()
    }
  }, [user])

  // جلب إحصائيات المستخدم
  const fetchUserStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/stats', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setStats({
            propertiesCount: data.data.propertiesCount,
            viewsCount: data.data.viewsCount,
            favoritesCount: data.data.favoritesCount,
            rating: data.data.rating,
            reviewsCount: data.data.reviewsCount || 0,
            joinDate: data.data.joinDate
          })
          setRecentActivity(data.data.recentActivity || [])
        }
      } else {
        console.error('Failed to fetch user stats')
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // حفظ التعديلات
  const handleSave = async () => {
    try {
      setSaving(true)
      console.log('💾 Saving profile data...', profileData)
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'update_profile',
          data: {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            phone: profileData.phone,
            userType: profileData.userType
          }
        }),
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        console.log('✅ Profile updated successfully')
        setIsEditing(false)
        // إعادة جلب الإحصائيات
        fetchUserStats()
        // يمكن إضافة toast notification هنا
      } else {
        console.error('❌ Failed to update profile:', data.message)
        // يمكن إضافة error notification هنا
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error)
      // يمكن إضافة error notification هنا
    } finally {
      setSaving(false)
    }
  }

  // تنسيق نوع المستخدم
  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'AGENT': return 'وسيط عقاري'
      case 'COMPANY': return 'شركة عقارية'
      case 'ADMIN': return 'مدير'
      case 'INDIVIDUAL': return 'مستخدم فردي'
      default: return 'مستخدم'
    }
  }

  // أيقونة نوع المستخدم
  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'AGENT': return <UserIcon className="w-5 h-5" />
      case 'COMPANY': return <BuildingOfficeIcon className="w-5 h-5" />
      case 'ADMIN': return <CogIcon className="w-5 h-5" />
      default: return <UserCircleIcon className="w-5 h-5" />
    }
  }

  // أيقونة حالة التوثيق
  const getVerificationIcon = (verified: boolean) => {
    return verified ? (
      <CheckCircleIconSolid className="w-5 h-5 text-green-500" />
    ) : (
      <XCircleIcon className="w-5 h-5 text-red-500" />
    )
  }

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (days > 7) {
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } else if (days > 0) {
      return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`
    } else if (hours > 0) {
      return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`
    } else if (minutes > 0) {
      return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`
    } else {
      return 'الآن'
    }
  }

  // أيقونات النشاطات
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'PROPERTY_VIEW':
        return <EyeIcon className="w-4 h-4 text-blue-600" />
      case 'PROPERTY_FAVORITE':
        return <StarIcon className="w-4 h-4 text-red-600" />
      case 'PROPERTY_CREATE':
        return <BuildingOfficeIcon className="w-4 h-4 text-emerald-600" />
      case 'PROPERTY_UPDATE':
        return <PencilIcon className="w-4 h-4 text-yellow-600" />
      case 'PROFILE_UPDATE':
        return <PencilIcon className="w-4 h-4 text-purple-600" />
      case 'LOGIN':
        return <UserIcon className="w-4 h-4 text-green-600" />
      case 'LOGIN_2FA':
        return <UserIcon className="w-4 h-4 text-green-700" />
      case 'EMAIL_VERIFICATION':
        return <EnvelopeIcon className="w-4 h-4 text-blue-600" />
      case 'PASSWORD_CHANGE':
        return <KeyIcon className="w-4 h-4 text-red-600" />
      case '2FA_ENABLED':
        return <ShieldCheckIcon className="w-4 h-4 text-green-600" />
      case 'LOGOUT':
        return <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-600" />
      case 'REGISTER':
        return <UserPlusIcon className="w-4 h-4 text-blue-600" />
      default:
        return <ClockIcon className="w-4 h-4 text-gray-600" />
    }
  }

  // إحصائيات سريعة
  const quickStats = [
    {
      label: 'العقارات المنشورة',
      value: stats.propertiesCount,
      icon: BuildingOfficeIcon,
      color: 'text-blue-600 bg-blue-50',
      change: stats.propertiesCount > 0 ? '+' + Math.round((stats.propertiesCount / 10) * 100) + '%' : '0%'
    },
    {
      label: 'المشاهدات',
      value: stats.viewsCount.toLocaleString(),
      icon: EyeIcon,
      color: 'text-green-600 bg-green-50',
      change: stats.viewsCount > 0 ? '+' + Math.round((stats.viewsCount / 100)) + '%' : '0%'
    },
    {
      label: 'المفضلة',
      value: stats.favoritesCount,
      icon: StarIcon,
      color: 'text-yellow-600 bg-yellow-50',
      change: stats.favoritesCount > 0 ? '+' + Math.round((stats.favoritesCount / 5) * 10) + '%' : '0%'
    },
    {
      label: 'التقييم',
      value: stats.rating ? `⭐ ${stats.rating.toFixed(1)}` : '🆕 جديد',
      icon: TrophyIcon,
      color: 'text-purple-600 bg-purple-50',
      change: stats.rating 
        ? (stats.rating >= 4.5 ? 'ممتاز' : stats.rating >= 4.0 ? 'جيد جداً' : 'جيد')
        : `${stats.reviewsCount} تقييم`
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      {loading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">جاري تحميل البيانات...</span>
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
                  الملف الشخصي
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  إدارة بياناتك الشخصية وإعدادات الحساب
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 space-x-reverse">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200">
                <BellIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200">
                <CogIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
            >
              {/* Cover Background */}
              <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute bottom-4 left-4">
                  <SparklesIcon className="w-6 h-6 text-white/80" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="px-6 pb-6 -mt-16 relative">
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center border-4 border-white relative">
                    {profileData.avatar ? (
                      <img 
                        src={profileData.avatar} 
                        alt="Profile" 
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-2xl">
                        {profileData.firstName?.charAt(0) || 'م'}
                      </span>
                    )}
                  </div>
                  
                  {/* Verification Badge */}
                  {profileData.verified && (
                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                      <CheckCircleIconSolid className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  {/* Camera Button */}
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center border-2 border-white shadow-lg hover:bg-gray-700 transition-colors">
                    <CameraIcon className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Name & Type */}
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    {getUserTypeIcon(profileData.userType)}
                    <span>{getUserTypeLabel(profileData.userType)}</span>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {stats.rating ? (
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIconSolid 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(stats.rating!) ? 'text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="text-sm font-semibold text-gray-700 ml-1">
                            {stats.rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          من {stats.reviewsCount} تقييم
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className="w-3 h-3 text-gray-300" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {stats.reviewsCount > 0 ? `${stats.reviewsCount} بانتظار التقييم` : 'عضو جديد'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {profileData.bio && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 text-center leading-relaxed">
                      {profileData.bio}
                    </p>
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <EnvelopeIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700 flex-1">{profileData.email}</span>
                    {getVerificationIcon(profileData.emailVerified)}
                  </div>
                  
                  {profileData.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <PhoneIcon className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 flex-1">{profileData.phone}</span>
                      {getVerificationIcon(profileData.phoneVerified)}
                    </div>
                  )}
                  
                  {profileData.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                        <MapPinIcon className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-gray-700 flex-1">{profileData.location}</span>
                    </div>
                  )}
                  
                  {profileData.website && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <GlobeAltIcon className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="text-gray-700 flex-1">{profileData.website}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                      <CalendarIcon className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-gray-700 flex-1">
                      عضو منذ {formatDate(profileData.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <PencilIcon className="w-4 h-4" />
                  {isEditing ? 'إلغاء التعديل' : 'تعديل الملف الشخصي'}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {quickStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Profile Edit Form */}
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">تعديل البيانات الشخصية</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                    >
                      {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الأول</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">اسم العائلة</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الموقع</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      placeholder="المدينة، الدولة"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الشركة</label>
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      placeholder="اسم الشركة أو المؤسسة"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الموقع الإلكتروني</label>
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">نبذة شخصية</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={4}
                    placeholder="اكتب نبذة مختصرة عن نفسك وخبراتك في مجال العقارات..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">نظرة عامة على الحساب</h3>
                
                {/* Account Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircleIconSolid className="w-8 h-8 text-green-600" />
                      <div>
                        <div className="font-semibold text-green-900">حساب نشط</div>
                        <div className="text-sm text-green-700">جميع الخدمات متاحة</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`bg-gradient-to-r border rounded-xl p-4 ${
                    profileData.verified 
                      ? 'from-blue-50 to-indigo-50 border-blue-200' 
                      : 'from-yellow-50 to-orange-50 border-yellow-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <ShieldCheckIcon className={`w-8 h-8 ${
                        profileData.verified ? 'text-blue-600' : 'text-yellow-600'
                      }`} />
                      <div>
                        <div className={`font-semibold ${
                          profileData.verified ? 'text-blue-900' : 'text-yellow-900'
                        }`}>
                          {profileData.verified ? 'حساب موثق' : 'في انتظار التوثيق'}
                        </div>
                        <div className={`text-sm ${
                          profileData.verified ? 'text-blue-700' : 'text-yellow-700'
                        }`}>
                          {profileData.verified ? 'تم التحقق من الهوية' : 'يتطلب توثيق الهوية'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`bg-gradient-to-r ${
                    profileData.membership?.levelData?.color === 'gold' ? 'from-yellow-50 to-amber-50 border-yellow-200' :
                    profileData.membership?.levelData?.color === 'purple' ? 'from-purple-50 to-pink-50 border-purple-200' :
                    profileData.membership?.levelData?.color === 'blue' ? 'from-blue-50 to-indigo-50 border-blue-200' :
                    'from-gray-50 to-slate-50 border-gray-200'
                  } border rounded-xl p-4`}>
                    <div className="flex items-center gap-3">
                      <TrophyIcon className={`w-8 h-8 ${
                        profileData.membership?.levelData?.color === 'gold' ? 'text-yellow-600' :
                        profileData.membership?.levelData?.color === 'purple' ? 'text-purple-600' :
                        profileData.membership?.levelData?.color === 'blue' ? 'text-blue-600' :
                        'text-gray-600'
                      }`} />
                      <div>
                        <div className={`font-semibold ${
                          profileData.membership?.levelData?.color === 'gold' ? 'text-yellow-900' :
                          profileData.membership?.levelData?.color === 'purple' ? 'text-purple-900' :
                          profileData.membership?.levelData?.color === 'blue' ? 'text-blue-900' :
                          'text-gray-900'
                        }`}>
                          {profileData.membership?.levelData?.icon} {profileData.membership?.levelData?.description || 'عضو أساسي'}
                        </div>
                        <div className={`text-sm ${
                          profileData.membership?.levelData?.color === 'gold' ? 'text-yellow-700' :
                          profileData.membership?.levelData?.color === 'purple' ? 'text-purple-700' :
                          profileData.membership?.levelData?.color === 'blue' ? 'text-blue-700' :
                          'text-gray-700'
                        }`}>
                          {profileData.membership?.experienceData?.icon} {profileData.membership?.experienceData?.description || 'عضو جديد'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* نقاط الثقة والتقدم */}
                  {profileData.membership && (
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-bold">🎯</span>
                          </div>
                          <div>
                            <div className="font-semibold text-indigo-900">نقاط الثقة</div>
                            <div className="text-sm text-indigo-700">{profileData.membership.trustScore}/100</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-600">{profileData.membership.trustScore}%</div>
                        </div>
                      </div>
                      
                      {/* شريط التقدم */}
                      <div className="w-full bg-indigo-100 rounded-full h-2 mb-3">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${profileData.membership.trustScore}%` }}
                        ></div>
                      </div>
                      
                      {/* التقدم نحو المستوى التالي */}
                      {profileData.membership.progress.nextLevel && (
                        <div className="text-sm text-indigo-700">
                          <div className="font-medium mb-2">التقدم نحو {profileData.membership.progress.nextLevel}:</div>
                          <div className="w-full bg-indigo-100 rounded-full h-1.5 mb-2">
                            <div 
                              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${profileData.membership.progress.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs">
                            {profileData.membership.progress.requirements.length > 0 && (
                              <div>
                                <span className="font-medium">المطلوب:</span>
                                <ul className="list-disc list-inside mt-1">
                                  {profileData.membership.progress.requirements.slice(0, 2).map((req, index) => (
                                    <li key={index}>{req}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">النشاط الأخير</h4>
                  <div className="space-y-3">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              {getActivityIcon(activity.type || activity.action)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-700">
                                {activity.details || activity.title || activity.action}
                              </span>
                              {activity.action && activity.details && (
                                <span className="text-xs text-gray-500">
                                  {activity.action}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(activity.createdAt)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm">لا توجد أنشطة حديثة</p>
                        <p className="text-xs">ابدأ بإضافة عقار أو تصفح العقارات المتاحة</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(ProfilePage)