import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import notificationStore from '@/lib/notification-store'

// GET - الحصول على إشعارات المستخدم (مؤقت - بيانات وهمية)
export async function GET(request: NextRequest) {
  try {
    console.log('📢 Notifications API called')
    
    // التحقق من المصادقة
    const token = request.cookies.get('token')?.value
    console.log('🔑 Token exists:', !!token)
    
    if (!token) {
      console.log('❌ No token provided')
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      console.log('❌ Invalid token')
      return NextResponse.json({ error: 'رمز غير صحيح' }, { status: 401 })
    }
    
    const userId = decoded.userId
    console.log('👤 User ID:', userId)

    // الحصول على الإشعارات من Mock Store
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // جلب الإشعارات الحقيقية من Store فقط
    const storeNotifications = notificationStore.getUserNotifications(userId, limit)
    console.log('🗄️ Store notifications count:', storeNotifications.length)
    
    // ترتيب الإشعارات حسب التاريخ (الأحدث أولاً)
    const notifications = storeNotifications
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)

    // حساب عدد الإشعارات غير المقروءة
    const unreadCount = notificationStore.getUnreadCount(userId)

    console.log('✅ Returning notifications:', notifications.length, 'unread:', unreadCount)

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      pagination: {
        page: 1,
        limit,
        total: storeNotifications.length,
        pages: Math.ceil(storeNotifications.length / limit)
      }
    })

  } catch (error) {
    console.error('خطأ في جلب الإشعارات:', error)
    return NextResponse.json({ error: 'خطأ في جلب الإشعارات' }, { status: 500 })
  }
}

// POST - إنشاء إشعار جديد
export async function POST(request: NextRequest) {
  try {
    console.log('📢 Creating new notification')
    
    // التحقق من المصادقة
    const token = request.cookies.get('token')?.value
    if (!token) {
      console.log('❌ No token provided')
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      console.log('❌ Invalid token')
      return NextResponse.json({ error: 'رمز غير صحيح' }, { status: 401 })
    }
    
    const userId = decoded.userId
    const body = await request.json()
    const { type, title, message, relatedId, metadata } = body

    console.log('📬 Creating notification for user:', userId, 'type:', type)

    // إضافة الإشعار إلى Store
    const notification = notificationStore.addNotification({
      userId,
      type,
      title,
      message,
      relatedId,
      metadata,
      read: false
    })

    console.log('✅ Notification created:', notification.id)

    return NextResponse.json({
      success: true,
      notification,
      message: 'تم إنشاء الإشعار بنجاح'
    })

  } catch (error) {
    console.error('خطأ في إنشاء الإشعار:', error)
    return NextResponse.json({ error: 'خطأ في إنشاء الإشعار' }, { status: 500 })
  }
}

// PUT - تحديث حالة القراءة للإشعارات
export async function PUT(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'رمز غير صحيح' }, { status: 401 })
    }

    const body = await request.json()
    const { notificationIds, markAsRead } = body

    // للاختبار - نرجع نجاح مؤقت
    return NextResponse.json({
      success: true,
      message: 'تم تحديث حالة الإشعارات بنجاح',
      unreadCount: markAsRead ? 0 : 2 // قيمة وهمية
    })

  } catch (error) {
    console.error('خطأ في تحديث الإشعارات:', error)
    return NextResponse.json({ error: 'خطأ في تحديث الإشعارات' }, { status: 500 })
  }
}