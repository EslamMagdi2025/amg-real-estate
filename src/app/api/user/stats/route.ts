import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بالوصول' },
        { status: 401 }
      )
    }

    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'رمز الدخول غير صالح' },
        { status: 401 }
      )
    }

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        properties: {
          select: {
            id: true,
            views: true,
            favorites: {
              select: { id: true }
            }
          }
        },
        favorites: {
          select: { id: true }
        },
        activities: {
          select: { id: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // حساب الإحصائيات
    const propertiesCount = user.properties.length
    const favoritesCount = user.favorites.length
    const activitiesCount = user.activities.length
    
    // حساب إجمالي المشاهدات
    const totalViews = user.properties.reduce((sum: number, property: any) => {
      return sum + (property.views || 0)
    }, 0)

    // حساب إجمالي المفضلة لعقارات المستخدم
    const totalFavoritesReceived = user.properties.reduce((sum: number, property: any) => {
      return sum + property.favorites.length
    }, 0)

    // حساب التقييم الحقيقي من reviews
    const reviews = await prisma.reviews.findMany({
      where: { targetId: user.id },
      select: {
        rating: true,
        communication: true,
        reliability: true,
        professionalism: true
      }
    })

    let rating = null
    let reviewsCount = reviews.length
    if (reviewsCount > 0) {
      // حساب متوسط التقييم
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      rating = Math.round((totalRating / reviewsCount) * 10) / 10
    }

    // احصائيات إضافية
    const recentActivity = await prisma.userActivity.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        action: true,
        details: true,
        createdAt: true
      }
    })

    const stats = {
      propertiesCount,
      viewsCount: totalViews,
      favoritesCount,
      favoritesReceived: totalFavoritesReceived,
      activitiesCount,
      rating: rating,
      reviewsCount: reviewsCount,
      joinDate: user.createdAt.toISOString(),
      recentActivity: recentActivity.map((activity: any) => ({
        id: activity.id,
        type: activity.action, // استخدام action بدلاً من activityType
        title: activity.details || activity.action, // استخدام details كـ title
        action: activity.action,
        details: activity.details,
        createdAt: activity.createdAt.toISOString()
      }))
    }

    return NextResponse.json({
      success: true,
      data: stats,
      message: 'تم جلب الإحصائيات بنجاح'
    })

  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ في جلب الإحصائيات',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}