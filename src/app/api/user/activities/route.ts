// ======================================================
// 📊 AMG Real Estate - User Activities API
// ======================================================
import { NextRequest, NextResponse } from 'next/server'
import { getUserActivities, getActivityStats } from '@/lib/activity-logger'
import { verifyToken } from '@/lib/auth'

// GET: جلب أنشطة المستخدم
export async function GET(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح - تسجيل الدخول مطلوب' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'رمز غير صحيح' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const includeStats = searchParams.get('stats') === 'true'
    const activityType = searchParams.get('type') || null
    const searchTerm = searchParams.get('search') || null

    console.log(`🔍 Fetching activities for user ${decoded.userId}`)

    // جلب الأنشطة مع الفلاتر
    const activities = await getUserActivities(decoded.userId, limit, offset, activityType, searchTerm)

    // تحضير البيانات للعرض
    const formattedActivities = activities.map((activity: any) => ({
      id: activity.id,
      action: activity.action,
      details: activity.details,
      ipAddress: activity.ipAddress,
      userAgent: activity.userAgent,
      location: activity.location,
      createdAt: activity.createdAt.toISOString(),
      // إضافة أيقونة ولون حسب النوع
      ...getActivityDisplayInfo(activity.action)
    }))

    let stats = null
    if (includeStats) {
      stats = await getActivityStats(decoded.userId)
    }

    console.log(`✅ Retrieved ${activities.length} activities`)

    return NextResponse.json({
      success: true,
      message: `تم جلب ${activities.length} نشاط`,
      activities: formattedActivities,
      stats,
      total: formattedActivities.length,
      pagination: {
        limit,
        offset,
        hasMore: activities.length === limit
      }
    })

  } catch (error) {
    console.error('❌ Activities fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'حدث خطأ أثناء جلب الأنشطة'
      },
      { status: 500 }
    )
  }
}

// دالة مساعدة لتحديد معلومات العرض حسب نوع النشاط
function getActivityDisplayInfo(activityType: string) {
  const activityMap: Record<string, { icon: string; color: string; bgColor: string }> = {
    'LOGIN': {
      icon: 'ArrowRightOnRectangleIcon',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    'LOGOUT': {
      icon: 'ArrowLeftOnRectangleIcon', 
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    'REGISTER': {
      icon: 'UserPlusIcon',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    'PROPERTY_CREATE': {
      icon: 'BuildingOfficeIcon',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    'PROPERTY_UPDATE': {
      icon: 'PencilSquareIcon',
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100'
    },
    'PROPERTY_DELETE': {
      icon: 'TrashIcon',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    'PROPERTY_VIEW': {
      icon: 'EyeIcon',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    'PROPERTY_FAVORITE': {
      icon: 'HeartIcon',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    'PROPERTY_UNFAVORITE': {
      icon: 'HeartIcon',
      color: 'text-gray-500',
      bgColor: 'bg-gray-50'
    },
    'INQUIRY_CREATE': {
      icon: 'ChatBubbleLeftRightIcon',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    'PROFILE_UPDATE': {
      icon: 'UserCircleIcon',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    'PASSWORD_CHANGE': {
      icon: 'KeyIcon',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    'EMAIL_VERIFY': {
      icon: 'CheckBadgeIcon',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    'PHONE_VERIFY': {
      icon: 'DevicePhoneMobileIcon',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  }

  return activityMap[activityType] || {
    icon: 'InformationCircleIcon',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  }
}