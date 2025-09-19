'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  ClockIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { useAuth, withAuth } from '@/lib/AuthContext'
import Link from 'next/link'

// تعريف نوع النشاط
interface Activity {
  id: string
  action: string
  details: string
  ipAddress?: string
  userAgent?: string
  location?: string
  createdAt: string
}

// أيقونات النشاطات
const getActivityIcon = (action: string) => {
  switch (action) {
    case 'property_view':
      return <EyeIcon className="w-5 h-5 text-blue-500" />
    case 'property_favorite':
      return <HeartIcon className="w-5 h-5 text-red-500" />
    case 'property_unfavorite':
      return <HeartIcon className="w-5 h-5 text-gray-400" />
    case 'inquiry_create':
      return <ChatBubbleLeftIcon className="w-5 h-5 text-green-500" />
    case 'property_create':
      return <PlusIcon className="w-5 h-5 text-emerald-500" />
    case 'property_update':
      return <PencilIcon className="w-5 h-5 text-yellow-500" />
    case 'property_delete':
      return <TrashIcon className="w-5 h-5 text-red-600" />
    case 'login':
      return <UserIcon className="w-5 h-5 text-green-600" />
    case 'logout':
      return <UserIcon className="w-5 h-5 text-gray-500" />
    case 'register':
      return <UserIcon className="w-5 h-5 text-blue-600" />
    case 'profile_update':
      return <PencilIcon className="w-5 h-5 text-purple-500" />
    default:
      return <ClockIcon className="w-5 h-5 text-gray-500" />
  }
}

// ألوان النشاطات
const getActivityColor = (action: string) => {
  switch (action) {
    case 'property_view':
      return 'bg-blue-50 border-blue-200'
    case 'property_favorite':
      return 'bg-red-50 border-red-200'
    case 'property_unfavorite':
      return 'bg-gray-50 border-gray-200'
    case 'inquiry_create':
      return 'bg-green-50 border-green-200'
    case 'property_create':
      return 'bg-emerald-50 border-emerald-200'
    case 'property_update':
      return 'bg-yellow-50 border-yellow-200'
    case 'property_delete':
      return 'bg-red-50 border-red-300'
    case 'login':
      return 'bg-green-50 border-green-200'
    case 'logout':
      return 'bg-gray-50 border-gray-200'
    case 'register':
      return 'bg-blue-50 border-blue-200'
    case 'profile_update':
      return 'bg-purple-50 border-purple-200'
    default:
      return 'bg-gray-50 border-gray-200'
  }
}

// تسميات النشاطات
const getActivityTypeLabel = (action: string) => {
  switch (action) {
    case 'property_view':
      return 'مشاهدة'
    case 'property_favorite':
      return 'إضافة للمفضلة'
    case 'property_unfavorite':
      return 'إزالة من المفضلة'
    case 'inquiry_create':
      return 'استفسار'
    case 'property_create':
      return 'إضافة عقار'
    case 'property_update':
      return 'تحديث عقار'
    case 'property_delete':
      return 'حذف عقار'
    case 'login':
      return 'تسجيل دخول'
    case 'logout':
      return 'تسجيل خروج'
    case 'register':
      return 'تسجيل جديد'
    case 'profile_update':
      return 'تحديث الملف الشخصي'
    case 'password_change':
      return 'تغيير كلمة المرور'
    case 'email_verify':
      return 'تفعيل البريد الإلكتروني'
    case 'phone_verify':
      return 'تفعيل رقم الهاتف'
    default:
      return 'نشاط'
  }
}

function ActivitiesPage() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalActivities, setTotalActivities] = useState(0)

  console.log('🔍 ActivitiesPage component loaded', { user, loading })

  const activityTypes = [
    { value: 'all', label: 'جميع الأنشطة', icon: ClockIcon },
    { value: 'PROPERTY_VIEW', label: 'المشاهدات', icon: EyeIcon },
    { value: 'PROPERTY_FAVORITE', label: 'المفضلة', icon: HeartIcon },
    { value: 'INQUIRY_CREATE', label: 'الاستفسارات', icon: ChatBubbleLeftIcon },
    { value: 'PROPERTY_CREATE', label: 'العقارات المضافة', icon: PlusIcon },
    { value: 'PROPERTY_UPDATE', label: 'العقارات المحدثة', icon: PencilIcon },
    { value: 'LOGIN', label: 'تسجيل الدخول', icon: UserIcon },
  ]

  // جلب الأنشطة
  const fetchActivities = async (reset = false) => {
    try {
      setError(null) // مسح الأخطاء السابقة
      console.log('🔍 Fetching activities...', { filter, searchTerm, page })
      const currentPage = reset ? 1 : page
      const params = new URLSearchParams({
        limit: '20',
        offset: ((currentPage - 1) * 20).toString(),
        ...(filter !== 'all' && { type: filter }),
        ...(searchTerm && { search: searchTerm })
      })

      console.log('API URL:', `/api/user/activities?${params}`)
      const response = await fetch(`/api/user/activities?${params}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      console.log('Response ok:', response.ok)
      if (response.ok) {
        let data
        try {
          data = await response.json()
        } catch (jsonError) {
          console.error('❌ JSON parsing error:', jsonError)
          throw new Error('فشل في معالجة استجابة الخادم')
        }
        
        console.log('Raw API response:', data)
        console.log('Response type:', typeof data)
        console.log('Is array?', Array.isArray(data))
        console.log('Keys:', Object.keys(data || {}))
        
        // التأكد من وجود البيانات - التعامل مع أشكال مختلفة من الاستجابة
        let activitiesData = []
        
        if (data && data.activities && Array.isArray(data.activities)) {
          activitiesData = data.activities
          console.log('✅ Using data.activities')
        } else if (data && data.data && data.data.activities && Array.isArray(data.data.activities)) {
          activitiesData = data.data.activities
          console.log('✅ Using data.data.activities')
        } else if (Array.isArray(data)) {
          activitiesData = data
          console.log('✅ Using data directly (array)')
        } else {
          console.warn('❌ Unknown response format:', data)
          activitiesData = []
        }
        
        console.log('Final activities data:', activitiesData)
        console.log('Activities count:', activitiesData.length)
        
        if (reset) {
          setActivities(activitiesData || [])
          setPage(1)
        } else {
          setActivities(prev => [...(prev || []), ...(activitiesData || [])])
        }
        setHasMore((activitiesData || []).length === 20)
        setTotalActivities(data?.total || (activitiesData || []).length)
      } else {
        console.error('Failed to fetch activities:', response.status)
        const errorData = await response.json()
        console.error('Error response:', errorData)
        setError(`فشل في تحميل الأنشطة: ${errorData.message || 'خطأ غير معروف'}`)
      }
    } catch (error) {
      console.error('خطأ في جلب الأنشطة:', error)
      setError('حدث خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities(true)
  }, [filter, searchTerm])

  // تحميل المزيد
  const loadMore = () => {
    setPage(prev => prev + 1)
    fetchActivities()
  }

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 transition-colors">
                <ArrowLeftIcon className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">سجل الأنشطة</h1>
                <p className="text-sm text-gray-600 mt-1">
                  عرض شامل لجميع أنشطتك على المنصة ({totalActivities} نشاط)
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3 space-x-reverse">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user ? `${user.firstName} ${user.lastName}` : ''}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.userType === 'BROKER' ? 'وسيط عقاري' : 
                   user?.userType === 'DEVELOPER' ? 'مطور عقاري' : 
                   user?.userType === 'AGENCY' ? 'وكالة عقارية' : 'مستخدم فردي'}
                </p>
              </div>
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
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FunnelIcon className="w-5 h-5" />
                تصفية الأنشطة
              </h3>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="البحث في الأنشطة..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Activity Types */}
              <div className="space-y-2">
                {activityTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.value}
                      onClick={() => setFilter(type.value)}
                      className={`w-full text-right px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                        filter === type.value
                          ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="mr-3">
                    <p className="text-sm font-medium">{error}</p>
                    <button 
                      onClick={() => fetchActivities(true)}
                      className="mt-2 text-sm underline hover:no-underline"
                    >
                      إعادة المحاولة
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : activities.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 bg-white rounded-xl shadow-sm border"
              >
                <ClockIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد أنشطة</h3>
                <p className="text-gray-600 mb-4">لم تقم بأي نشاطات بعد. ابدأ بإضافة عقار أو تصفح العقارات المتاحة.</p>
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  العودة للداشبورد
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${getActivityColor(activity.action)}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        {getActivityIcon(activity.action)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded-full">
                            {getActivityTypeLabel(activity.action)}
                          </span>
                          <div className="flex items-center text-xs text-gray-500 gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {formatDate(activity.createdAt)}
                          </div>
                        </div>
                        
                        <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                          {getActivityTypeLabel(activity.action)}
                        </h4>
                        
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {activity.details}
                        </p>

                        {/* Location and IP Info */}
                        {(activity.location || activity.ipAddress) && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {activity.location && (
                              <span className="inline-flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                � {activity.location}
                              </span>
                            )}
                            {activity.ipAddress && (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                                🌐 {activity.ipAddress}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center py-6">
                    <button
                      onClick={loadMore}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
                    >
                      <ClockIcon className="w-4 h-4" />
                      تحميل المزيد من الأنشطة
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(ActivitiesPage)