'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  BellIcon,
  CheckIcon,
  EyeIcon,
  HeartIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/AuthContext'

// تعريف نوع الإشعار
interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: Date | string
  relatedId?: string
  metadata?: any
}

// خصائص المكون
interface NotificationsWidgetProps {
  limit?: number
  showHeader?: boolean
  className?: string
}

export default function NotificationsWidget({ 
  limit = 5, 
  showHeader = true,
  className = '' 
}: NotificationsWidgetProps) {
  const { user, isLoading: authLoading } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null)

  // جلب الإشعارات - فقط عند وجود مستخدم مسجل دخول
  useEffect(() => {
    if (authLoading) {
      return
    }
    
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    fetchNotifications()
  }, [limit, authLoading, user])

  const fetchNotifications = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      const response = await fetch(`/api/notifications?limit=${limit}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      } else if (response.status === 401) {
        setNotifications([])
        setUnreadCount(0)
      } else {
        setNotifications([])
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('خطأ في جلب الإشعارات:', error)
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }

  // وضع علامة مقروء على الإشعار
  const markAsRead = async (notificationId: string) => {
    if (markingAsRead || !user) return

    setMarkingAsRead(notificationId)

    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('خطأ في وضع علامة مقروء:', error)
    } finally {
      setMarkingAsRead(null)
    }
  }

  // الحصول على الرابط المناسب للإشعار
  const getNotificationLink = (notification: Notification) => {
    switch (notification.type) {
      case 'PROPERTY_APPROVED':
      case 'PROPERTY_REJECTED':
        return notification.relatedId ? `/properties/${notification.relatedId}` : '/dashboard/properties'
      case 'PROPERTY_INQUIRY':
        return '/dashboard/inquiries'
      case 'PROPERTY_FAVORITE':
        return notification.relatedId ? `/properties/${notification.relatedId}` : '/dashboard/favorites'
      case 'ACCOUNT_UPDATE':
        return '/dashboard/profile'
      default:
        return '#'
    }
  }

  // التحقق من وجود رابط صالح للإشعار
  const hasValidLink = (notification: Notification) => {
    const link = getNotificationLink(notification)
    return link !== '#'
  }

  // أيقونة نوع الإشعار
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'PROPERTY_APPROVED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'PROPERTY_REJECTED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'PROPERTY_INQUIRY':
        return <EyeIcon className="h-5 w-5 text-blue-500" />
      case 'PROPERTY_FAVORITE':
        return <HeartIcon className="h-5 w-5 text-red-500" />
      case 'ACCOUNT_UPDATE':
        return <UserIcon className="h-5 w-5 text-purple-500" />
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />
    }
  }

  // تنسيق وقت الإشعار
  const formatNotificationTime = (createdAt: Date | string) => {
    const date = new Date(createdAt)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'منذ قليل'
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `منذ ${diffInDays} يوم`
    }
  }

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        {showHeader && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BellIcon className="h-5 w-5 text-gray-500 ml-2" />
              الإشعارات
            </h3>
          </div>
        )}
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex space-x-4 space-x-reverse">
                <div className="rounded-full bg-gray-300 h-8 w-8"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // إذا لم يكن هناك مستخدم مسجل دخول
  if (!user) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        {showHeader && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BellIcon className="h-5 w-5 text-gray-500 ml-2" />
              الإشعارات
            </h3>
          </div>
        )}
        <div className="p-6 text-center">
          <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">سجل دخولك لرؤية الإشعارات</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {showHeader && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BellIcon className="h-5 w-5 text-gray-500 ml-2" />
              الإشعارات
              {unreadCount > 0 && (
                <span className="mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {unreadCount}
                </span>
              )}
            </h3>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد إشعارات جديدة</p>
          </div>
        ) : (
          notifications.map((notification, index) => {
            const notificationLink = getNotificationLink(notification)
            const isClickable = hasValidLink(notification)
            
            const NotificationContent = () => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 transition-colors duration-200 ${
                  !notification.read ? 'bg-blue-50 border-r-4 border-blue-400' : ''
                } ${isClickable ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
              >
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                          {isClickable && (
                            <ArrowTopRightOnSquareIcon className="inline h-3 w-3 text-gray-400 mr-1" />
                          )}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatNotificationTime(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification.id)
                            }}
                            disabled={markingAsRead === notification.id}
                            className="flex-shrink-0 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                            title="وضع علامة مقروء"
                          >
                            {markingAsRead === notification.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            ) : (
                              <CheckIcon className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )

            // إذا كان الإشعار قابل للنقر، اربطه برابط
            if (isClickable) {
              return (
                <Link key={notification.id} href={notificationLink}>
                  <NotificationContent />
                </Link>
              )
            }

            // وإلا اعرضه كعنصر عادي
            return <NotificationContent key={notification.id} />
          })
        )}
      </div>
    </div>
  )
}