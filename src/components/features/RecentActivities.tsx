'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ClockIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  UserPlusIcon,
  BuildingOfficeIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  KeyIcon,
  CheckBadgeIcon,
  DevicePhoneMobileIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

interface Activity {
  id: string
  activityType: string // Update from 'type' to 'activityType'
  entityType: string | null
  entityId: string | null
  title: string
  description: string | null
  metadata: any
  createdAt: string
  icon?: string
  color?: string
  bgColor?: string
}

interface RecentActivitiesProps {
  limit?: number
  showStats?: boolean
  className?: string
}

export default function RecentActivities({ 
  limit = 10, 
  showStats = false, 
  className = '' 
}: RecentActivitiesProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [stats, setStats] = useState<Record<string, number> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // دالة لتحديد الأيقونة والألوان حسب نوع النشاط
  const getActivityDisplayInfo = (activityType: string) => {
    switch (activityType) {
      case 'PROPERTY_VIEW':
        return {
          icon: 'EyeIcon',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          title: 'مشاهدة عقار'
        }
      case 'PROPERTY_FAVORITE':
        return {
          icon: 'HeartIcon',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          title: 'إضافة إلى المفضلة'
        }
      case 'PROPERTY_UNFAVORITE':
        return {
          icon: 'HeartIcon',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          title: 'إزالة من المفضلة'
        }
      case 'INQUIRY_CREATE':
        return {
          icon: 'ChatBubbleLeftRightIcon',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          title: 'إرسال استفسار'
        }
      case 'PROPERTY_CREATE':
        return {
          icon: 'BuildingOfficeIcon',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-100',
          title: 'إضافة عقار جديد'
        }
      case 'PROPERTY_UPDATE':
        return {
          icon: 'PencilSquareIcon',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          title: 'تحديث عقار'
        }
      case 'PROPERTY_DELETE':
        return {
          icon: 'TrashIcon',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          title: 'حذف عقار'
        }
      case 'LOGIN':
        return {
          icon: 'ArrowRightOnRectangleIcon',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          title: 'تسجيل دخول'
        }
      case 'LOGOUT':
        return {
          icon: 'ArrowLeftOnRectangleIcon',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          title: 'تسجيل خروج'
        }
      case 'REGISTER':
        return {
          icon: 'UserPlusIcon',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          title: 'تسجيل حساب جديد'
        }
      case 'PROFILE_UPDATE':
        return {
          icon: 'UserCircleIcon',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          title: 'تحديث الملف الشخصي'
        }
      default:
        return {
          icon: 'InformationCircleIcon',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          title: 'نشاط عام'
        }
    }
  }

  // خريطة الأيقونات
  const iconMap: Record<string, any> = {
    'ArrowRightOnRectangleIcon': ArrowRightOnRectangleIcon,
    'ArrowLeftOnRectangleIcon': ArrowLeftOnRectangleIcon,
    'UserPlusIcon': UserPlusIcon,
    'BuildingOfficeIcon': BuildingOfficeIcon,
    'PencilSquareIcon': PencilSquareIcon,
    'TrashIcon': TrashIcon,
    'EyeIcon': EyeIcon,
    'HeartIcon': HeartIcon,
    'ChatBubbleLeftRightIcon': ChatBubbleLeftRightIcon,
    'UserCircleIcon': UserCircleIcon,
    'KeyIcon': KeyIcon,
    'CheckBadgeIcon': CheckBadgeIcon,
    'DevicePhoneMobileIcon': DevicePhoneMobileIcon,
    'InformationCircleIcon': InformationCircleIcon
  }

  // جلب الأنشطة
  const fetchActivities = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: '0'
      })

      if (showStats) {
        params.append('stats', 'true')
      }

      const response = await fetch(`/api/user/activities?${params}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        console.log('RecentActivities API response:', data)
        
        // التعامل مع أشكال مختلفة من الاستجابة
        let activitiesData = []
        if (data.activities && Array.isArray(data.activities)) {
          activitiesData = data.activities
        } else if (data.data && data.data.activities && Array.isArray(data.data.activities)) {
          activitiesData = data.data.activities
        } else if (Array.isArray(data)) {
          activitiesData = data
        }
        
        setActivities(activitiesData || [])
        if (data.stats || (data.data && data.data.stats)) {
          setStats(data.stats || data.data.stats)
        }
        setError('')
      } else {
        console.error('RecentActivities API error:', response.status)
        setError('حدث خطأ أثناء جلب الأنشطة')
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [limit, showStats])

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const now = new Date()
    const activityDate = new Date(dateString)
    const diffMs = now.getTime() - activityDate.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 1) {
      return 'الآن'
    } else if (diffMinutes < 60) {
      return `منذ ${diffMinutes} دقيقة`
    } else if (diffHours < 24) {
      return `منذ ${diffHours} ساعة`
    } else if (diffDays < 7) {
      return `منذ ${diffDays} يوم`
    } else {
      return activityDate.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }

  if (loading && activities.length === 0) {
    return (
      <div className={`${className === 'compact' ? '' : 'bg-white rounded-lg shadow-sm p-6'} ${className !== 'compact' ? className : ''}`}>
        {className !== 'compact' && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ClockIcon className="h-5 w-5 ml-2 text-gray-500" />
              النشاط الأخير
            </h3>
          </div>
        )}
        <div className={`text-center ${className === 'compact' ? 'py-4' : 'py-8'}`}>
          <ArrowPathIcon className={`animate-spin text-blue-600 mx-auto mb-2 ${
            className === 'compact' ? 'h-4 w-4' : 'h-6 w-6'
          }`} />
          <p className={`text-gray-600 ${className === 'compact' ? 'text-xs' : 'text-sm'}`}>
            جاري تحميل الأنشطة...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className === 'compact' ? '' : 'bg-white rounded-lg shadow-sm p-6'} ${className !== 'compact' ? className : ''}`}>
      {/* Header - Only show in non-compact mode */}
      {className !== 'compact' && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ClockIcon className="h-5 w-5 ml-2 text-gray-500" />
            النشاط الأخير
          </h3>
          {activities.length > 0 && (
            <button
              onClick={fetchActivities}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center transition-colors"
              disabled={loading}
            >
              <ArrowPathIcon className={`h-4 w-4 ml-1 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </button>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Activities List */}
      {activities.length > 0 ? (
        <div className={className === 'compact' ? 'space-y-2' : 'space-y-4'}>
          {activities.map((activity, index) => {
            // تحديد معلومات العرض للنشاط
            const displayInfo = getActivityDisplayInfo(activity.activityType)
            const IconComponent = iconMap[displayInfo.icon] || InformationCircleIcon
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start space-x-3 space-x-reverse ${
                  className === 'compact' 
                    ? 'p-2 rounded-lg hover:bg-gray-50 transition-colors' 
                    : 'p-3 rounded-lg hover:bg-gray-50 transition-colors'
                }`}
              >
                {/* Activity Icon */}
                <div className={`flex-shrink-0 ${
                  className === 'compact' ? 'p-1.5' : 'p-2'
                } rounded-full ${displayInfo.bgColor}`}>
                  <IconComponent className={`${
                    className === 'compact' ? 'h-3 w-3' : 'h-4 w-4'
                  } ${displayInfo.color}`} />
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {displayInfo.title}
                    </p>
                    <span className="text-xs text-gray-500 flex-shrink-0 mr-2">
                      {formatDate(activity.createdAt)}
                    </span>
                  </div>
                  
                  {activity.description && (
                    <p className={`text-gray-600 mt-1 line-clamp-2 ${
                      className === 'compact' ? 'text-xs' : 'text-xs'
                    }`}>
                      {activity.description}
                    </p>
                  )}

                  {/* Metadata - Hide in compact mode */}
                  {activity.metadata && className !== 'compact' && (
                    <div className="mt-2">
                      {activity.activityType === 'PROPERTY_CREATE' && activity.metadata.propertyType && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {activity.metadata.propertyType}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className={`text-center ${className === 'compact' ? 'py-4' : 'py-8'}`}>
          <ClockIcon className={`text-gray-300 mx-auto mb-2 ${
            className === 'compact' ? 'h-8 w-8' : 'h-12 w-12'
          }`} />
          <p className={`text-gray-600 ${className === 'compact' ? 'text-xs' : 'text-sm'}`}>
            لا توجد أنشطة حديثة
          </p>
          {className !== 'compact' && (
            <p className="text-gray-500 text-xs mt-1">
              ستظهر هنا أنشطتك الأخيرة عند استخدام الموقع
            </p>
          )}
        </div>
      )}

      {/* Stats Summary (إن كان مطلوب) */}
      {showStats && stats && Object.keys(stats).length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">إحصائيات آخر 30 يوم</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(stats).slice(0, 4).map(([type, count]) => (
              <div key={type} className="text-center">
                <div className="text-lg font-semibold text-gray-900">{count}</div>
                <div className="text-xs text-gray-500">
                  {getActivityTypeLabel(type)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View All Link */}
      {activities.length >= limit && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link href="/dashboard/activities">
            <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105">
              <ClockIcon className="w-4 h-4" />
              عرض جميع الأنشطة
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}

// دالة مساعدة لترجمة أنواع الأنشطة
function getActivityTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'LOGIN': 'تسجيل دخول',
    'LOGOUT': 'تسجيل خروج',
    'REGISTER': 'تسجيل حساب',
    'PROPERTY_CREATE': 'إضافة عقار',
    'PROPERTY_UPDATE': 'تحديث عقار',
    'PROPERTY_DELETE': 'حذف عقار',
    'PROPERTY_VIEW': 'عرض عقار',
    'PROPERTY_FAVORITE': 'إضافة مفضلة',
    'PROPERTY_UNFAVORITE': 'إزالة مفضلة',
    'INQUIRY_CREATE': 'استفسار',
    'PROFILE_UPDATE': 'تحديث ملف',
    'PASSWORD_CHANGE': 'تغيير كلمة مرور',
    'EMAIL_VERIFY': 'تفعيل بريد',
    'PHONE_VERIFY': 'تفعيل هاتف'
  }
  
  return labels[type] || type
}