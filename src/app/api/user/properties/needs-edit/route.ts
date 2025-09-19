import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import notificationStore from '@/lib/notification-store'

// GET - جلب العقارات التي تحتاج تعديل للمستخدم الحالي
export async function GET(request: NextRequest) {
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
    const userId = decoded.userId

    // البحث عن إشعارات "تحتاج تعديل" للمستخدم من الـ store
    const editNotifications = notificationStore.getUserNotifications(userId, 50)
      .filter(n => n.type === 'PROPERTY_NEEDS_EDIT')

    console.log('🔍 Found edit notifications:', editNotifications.length)

    // تحويل الإشعارات إلى بيانات عقارات
    const propertiesFromNotifications = editNotifications.map((notification, index) => ({
      id: notification.relatedId || `prop_${index + 1}`,
      title: notification.metadata?.propertyTitle || 'عقار غير محدد',
      description: 'وصف العقار...',
      price: '2500000',
      currency: 'EGP',
      area: 150,
      bedrooms: 3,
      bathrooms: 2,
      city: 'القاهرة',
      district: 'المعادي',
      propertyType: 'APARTMENT',
      purpose: 'SALE',
      status: 'NEEDS_EDIT',
      reviewStatus: 'NEEDS_EDIT',
      rejectionReason: notification.metadata?.rejectionReason || notification.message,
      reviewedBy: 'admin',
      reviewedAt: notification.createdAt.toISOString(),
      views: 45,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      updatedAt: notification.createdAt.toISOString(),
      mainImage: '/images/properties/property-1757959628944-0wp1yy.png',
      imagesCount: 8,
      stats: {
        favorites: 12,
        inquiries: 5
      }
    }))

    // بيانات وهمية للعقارات التي تحتاج تعديل (للاختبار فقط)
    const mockPropertiesNeedingEdit = [
      {
        id: '1',
        title: 'شقة 3 غرف في المعادي',
        description: 'شقة واسعة بإطلالة رائعة في منطقة المعادي المميزة...',
        price: '2500000',
        currency: 'EGP',
        area: 150,
        bedrooms: 3,
        bathrooms: 2,
        city: 'القاهرة',
        district: 'المعادي',
        propertyType: 'APARTMENT',
        purpose: 'SALE',
        status: 'NEEDS_EDIT',
        reviewStatus: 'NEEDS_EDIT',
        rejectionReason: 'يرجى إضافة صور أوضح للمطبخ والحمام وتحديث الوصف ليشمل مساحة الشرفة. كما يرجى تأكيد المساحة الدقيقة للعقار وإضافة معلومات عن موقف السيارات.',
        reviewedBy: 'admin',
        reviewedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // منذ 30 دقيقة
        views: 45,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // منذ 3 أيام
        updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        mainImage: '/images/properties/property-1757959628944-0wp1yy.png',
        imagesCount: 8,
        stats: {
          favorites: 12,
          inquiries: 5
        }
      },
      {
        id: '2',
        title: 'فيلا بحديقة في التجمع الخامس',
        description: 'فيلا مستقلة بحديقة واسعة في موقع متميز...',
        price: '8500000',
        currency: 'EGP',
        area: 400,
        bedrooms: 5,
        bathrooms: 4,
        city: 'القاهرة الجديدة',
        district: 'التجمع الخامس',
        propertyType: 'VILLA',
        purpose: 'SALE',
        status: 'NEEDS_EDIT',
        reviewStatus: 'NEEDS_EDIT',
        rejectionReason: 'يرجى إضافة صور للحديقة والمسبح وتحديث أسعار المرافق. كما يرجى توضيح ما إذا كانت الفيلا مؤثثة أم لا وإضافة خريطة موقع أوضح.',
        reviewedBy: 'admin',
        reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // منذ ساعتين
        views: 89,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // منذ 5 أيام
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        mainImage: '/images/properties/property-1757937097211-uc7tuo.png',
        imagesCount: 12,
        stats: {
          favorites: 28,
          inquiries: 15
        }
      }
    ]

    // دمج العقارات الحقيقية مع الوهمية
    const allProperties = [
      ...propertiesFromNotifications,
      ...mockPropertiesNeedingEdit
    ]

    // معاملات الاستعلام
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const properties = allProperties.slice(0, limit)

    return NextResponse.json({
      success: true,
      properties,
      count: properties.length,
      message: `تم العثور على ${properties.length} عقار يحتاج تعديل`
    })

  } catch (error) {
    console.error('خطأ في جلب العقارات التي تحتاج تعديل:', error)
    return NextResponse.json({ error: 'خطأ في جلب العقارات' }, { status: 500 })
  }
}

// PUT - تحديث عقار بعد التعديل
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
    const { propertyId, updates } = body

    // التحقق من المدخلات
    if (!propertyId) {
      return NextResponse.json({ error: 'معرف العقار مطلوب' }, { status: 400 })
    }

    // مؤقتاً - محاكاة تحديث العقار
    // في الواقع، هنا ستتم معالجة التحديثات وإرسالها لمراجعة الإدارة مرة أخرى

    return NextResponse.json({
      success: true,
      message: 'تم تحديث العقار بنجاح وأُرسل للمراجعة',
      property: {
        id: propertyId,
        status: 'PENDING', // يعود للمراجعة بعد التعديل
        updatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('خطأ في تحديث العقار:', error)
    return NextResponse.json({ error: 'خطأ في تحديث العقار' }, { status: 500 })
  }
}