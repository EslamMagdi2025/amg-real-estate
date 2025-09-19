import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { logUserActivity } from '@/lib/activity-logger'

// API لتسجيل مشاهدة عقار
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const propertyId = params.id
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    // جلب معلومات العقار للتأكد من وجوده
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { 
        id: true, 
        title: true, 
        views: true,
        userId: true,
        reviewStatus: true 
      }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, message: 'العقار غير موجود' },
        { status: 404 }
      )
    }

    // التأكد من أن العقار معتمد ومرئي للجمهور
    if (property.reviewStatus !== 'APPROVED') {
      return NextResponse.json(
        { success: false, message: 'العقار غير متاح للعرض' },
        { status: 403 }
      )
    }

    // الحصول على معلومات المستخدم إذا كان مسجل دخوله (اختياري)
    let userId: string | null = null
    const token = request.cookies.get('auth-token')?.value
    
    if (token) {
      try {
        const jwt = await import('jsonwebtoken')
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
        userId = decoded.userId
      } catch (error) {
        // لا بأس إذا فشل - يعني المستخدم غير مسجل دخوله
        console.log('No valid user token for view tracking')
      }
    }

    // تحديث عدد المشاهدات
    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: {
        views: { increment: 1 }
      },
      select: {
        id: true,
        views: true,
        title: true
      }
    })

    // تسجيل النشاط إذا كان المستخدم مسجل دخوله
    if (userId) {
      try {
        await logUserActivity({
          userId,
          activityType: 'PROPERTY_VIEW',
          entityType: 'PROPERTY',
          entityId: propertyId,
          title: 'مشاهدة عقار',
          description: `مشاهدة عقار: ${property.title}`,
          metadata: {
            propertyId: propertyId,
            propertyTitle: property.title,
            previousViews: property.views,
            newViews: updatedProperty.views
          },
          request
        })
      } catch (activityError) {
        console.error('Error logging activity:', activityError)
        // لا نريد أن نفشل العملية كاملة بسبب خطأ في تسجيل النشاط
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل المشاهدة بنجاح',
      views: updatedProperty.views,
      propertyId: propertyId
    })

  } catch (error) {
    console.error('Error recording property view:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'خطأ في تسجيل المشاهدة',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

// API لجلب إحصائيات المشاهدة
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const propertyId = params.id

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        views: true,
        createdAt: true,
        _count: {
          select: {
            favorites: true,
            inquiries: true
          }
        }
      }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, message: 'العقار غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        propertyId: propertyId,
        views: property.views,
        favorites: property._count.favorites,
        inquiries: property._count.inquiries,
        createdAt: property.createdAt
      }
    })

  } catch (error) {
    console.error('Error fetching property stats:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'خطأ في جلب الإحصائيات',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}