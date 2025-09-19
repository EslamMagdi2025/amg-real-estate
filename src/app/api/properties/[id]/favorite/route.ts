import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { logUserActivity } from '@/lib/activity-logger'

// إضافة/إزالة عقار من المفضلة
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // التحقق من المصادقة
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json(authResult, { status: authResult.status })
    }

    const userId = authResult.user!.id
    const params = await context.params
    const propertyId = params.id

    // التحقق من وجود العقار
    const property = await prisma.property.findUnique({
      where: { 
        id: propertyId,
        reviewStatus: 'APPROVED' // فقط العقارات المعتمدة
      },
      select: { id: true, title: true }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, message: 'العقار غير موجود' },
        { status: 404 }
      )
    }

    // التحقق من وجود المفضلة
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: userId,
          propertyId: propertyId
        }
      }
    })

    if (existingFavorite) {
      return NextResponse.json(
        { success: false, message: 'العقار موجود بالفعل في المفضلة' },
        { status: 400 }
      )
    }

    // إضافة للمفضلة
    await prisma.favorite.create({
      data: {
        userId: userId,
        propertyId: propertyId
      }
    })

    // تسجيل النشاط
    await logUserActivity({
      userId,
      activityType: 'PROPERTY_FAVORITE',
      entityType: 'PROPERTY',
      entityId: propertyId,
      title: 'إضافة للمفضلة',
      description: `إضافة عقار للمفضلة: ${property.title}`,
      metadata: { propertyId, propertyTitle: property.title },
      request
    })

    return NextResponse.json({
      success: true,
      message: 'تم إضافة العقار للمفضلة بنجاح'
    })

  } catch (error) {
    console.error('Error adding to favorites:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في إضافة العقار للمفضلة' },
      { status: 500 }
    )
  }
}

// إزالة عقار من المفضلة
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // التحقق من المصادقة
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json(authResult, { status: authResult.status })
    }

    const userId = authResult.user!.id
    const params = await context.params
    const propertyId = params.id

    // التحقق من وجود المفضلة
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: userId,
          propertyId: propertyId
        }
      },
      include: {
        property: {
          select: { title: true }
        }
      }
    })

    if (!existingFavorite) {
      return NextResponse.json(
        { success: false, message: 'العقار غير موجود في المفضلة' },
        { status: 404 }
      )
    }

    // إزالة من المفضلة
    await prisma.favorite.delete({
      where: {
        userId_propertyId: {
          userId: userId,
          propertyId: propertyId
        }
      }
    })

    // تسجيل النشاط
    await logUserActivity({
      userId,
      activityType: 'PROPERTY_UNFAVORITE',
      entityType: 'PROPERTY',
      entityId: propertyId,
      title: 'إزالة من المفضلة',
      description: `إزالة عقار من المفضلة: ${existingFavorite.property.title}`,
      metadata: { propertyId, propertyTitle: existingFavorite.property.title },
      request
    })

    return NextResponse.json({
      success: true,
      message: 'تم إزالة العقار من المفضلة بنجاح'
    })

  } catch (error) {
    console.error('Error removing from favorites:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في إزالة العقار من المفضلة' },
      { status: 500 }
    )
  }
}

// التحقق من وجود العقار في المفضلة
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // التحقق من المصادقة
    const authResult = await requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ isFavorite: false })
    }

    const userId = authResult.user!.id
    const params = await context.params
    const propertyId = params.id

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: userId,
          propertyId: propertyId
        }
      }
    })

    return NextResponse.json({
      success: true,
      isFavorite: !!favorite
    })

  } catch (error) {
    console.error('Error checking favorite status:', error)
    return NextResponse.json({
      success: false,
      isFavorite: false
    })
  }
}