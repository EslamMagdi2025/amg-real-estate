// Mock store للإشعارات - تخزين مؤقت في الذاكرة
// سيتم استبداله بقاعدة بيانات حقيقية لاحقاً

interface MockNotification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: Date
  relatedId?: string
  metadata?: any
}

class NotificationStore {
  private notifications: MockNotification[] = []  // تم مسح جميع الإشعارات
  private counter = 1

  // إضافة إشعار جديد
  addNotification(notification: Omit<MockNotification, 'id' | 'createdAt'>) {
    const newNotification: MockNotification = {
      ...notification,
      id: `notif_${this.counter++}`,
      createdAt: new Date()
    }
    
    this.notifications.unshift(newNotification) // إضافة في المقدمة
    console.log('📢 Added notification to store:', newNotification)
    return newNotification
  }

  // الحصول على إشعارات مستخدم معين
  getUserNotifications(userId: string, limit: number = 10) {
    return this.notifications
      .filter(n => n.userId === userId)
      .slice(0, limit)
  }

  // تحديث حالة القراءة
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
  }

  // عدد الإشعارات غير المقروءة
  getUnreadCount(userId: string) {
    return this.notifications.filter(n => n.userId === userId && !n.read).length
  }

  // الحصول على جميع الإشعارات (للتطوير)
  getAllNotifications() {
    return this.notifications
  }

  // مسح الإشعارات القديمة (أكثر من 30 يوم)
  cleanup() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    this.notifications = this.notifications.filter(n => n.createdAt > thirtyDaysAgo)
  }
}

// إنشاء instance وحيد
const notificationStore = new NotificationStore()

// تنظيف دوري كل ساعة
setInterval(() => {
  notificationStore.cleanup()
}, 60 * 60 * 1000)

export default notificationStore