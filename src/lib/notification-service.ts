// خدمة الإشعارات - ربط إجراءات الأدمن بإشعارات المستخدم
import { prisma } from '@/lib/db'
import notificationStore from './notification-store'

// إنشاء إشعار جديد
export async function createNotification({
  userId,
  type,
  title,
  message,
  relatedId,
  metadata
}: {
  userId: string
  type: string
  title: string
  message: string
  relatedId?: string
  metadata?: any
}) {
  try {
    console.log('📢 Creating notification:', {
      userId,
      type,
      title,
      message,
      relatedId,
      metadata
    })

    // إضافة للـ mock store مؤقتاً
    const notification = notificationStore.addNotification({
      userId,
      type,
      title,
      message,
      read: false,
      relatedId,
      metadata
    })

    // TODO: إضافة إلى قاعدة البيانات عندما يتم إنشاء جدول الإشعارات
    // const notification = await prisma.notification.create({
    //   data: {
    //     userId,
    //     type,
    //     title,
    //     message,
    //     relatedId,
    //     metadata: JSON.stringify(metadata),
    //     read: false
    //   }
    // })

    return { success: true, message: 'تم إنشاء الإشعار', notification }
  } catch (error) {
    console.error('خطأ في إنشاء الإشعار:', error)
    return { success: false, error: 'فشل في إنشاء الإشعار' }
  }
}

// إرسال إشعار عند الموافقة على العقار
export async function sendPropertyApprovedNotification(
  userId: string,
  propertyTitle: string,
  propertyId: string
) {
  return await createNotification({
    userId,
    type: 'PROPERTY_APPROVED',
    title: 'تمت الموافقة على عقارك',
    message: `تمت الموافقة على عقارك "${propertyTitle}" وتم نشره بنجاح`,
    relatedId: propertyId,
    metadata: {
      propertyId,
      propertyTitle,
      approved: true
    }
  })
}

// إرسال إشعار عند رفض العقار
export async function sendPropertyRejectedNotification(
  userId: string,
  propertyTitle: string,
  rejectionReason: string,
  propertyId: string
) {
  return await createNotification({
    userId,
    type: 'PROPERTY_REJECTED',
    title: 'تم رفض عقارك',
    message: `تم رفض عقارك "${propertyTitle}". السبب: ${rejectionReason}`,
    relatedId: propertyId,
    metadata: {
      propertyId,
      propertyTitle,
      rejectionReason,
      rejected: true
    }
  })
}

// تسجيل النشاط في سجل الأنشطة
export async function logPropertyReviewActivity(
  adminId: string,
  propertyId: string,
  action: string,
  details: any
) {
  try {
    console.log('📝 Logging property review activity:', {
      adminId,
      propertyId,
      action,
      details
    })

    // TODO: إضافة إلى جدول الأنشطة
    // await prisma.activity.create({
    //   data: {
    //     userId: adminId,
    //     type: 'ADMIN_PROPERTY_REVIEW',
    //     description: `${action} property ${propertyId}`,
    //     metadata: JSON.stringify(details)
    //   }
    // })

    return { success: true }
  } catch (error) {
    console.error('خطأ في تسجيل النشاط:', error)
    return { success: false, error }
  }
}