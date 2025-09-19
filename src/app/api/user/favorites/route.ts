// ======================================================
// 💖 AMG Real Estate - User Favorites API
// ======================================================
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// GET: جلب المفضلة للمستخدم
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
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = parseInt(searchParams.get('offset') || '0')
    const searchTerm = searchParams.get('search') || ''

    console.log(`🔍 Fetching favorites for user ${decoded.userId}`)

    // جلب المفضلة مع تفاصيل العقارات
    const whereCondition: any = {
      userId: decoded.userId
    }

    // إضافة البحث إذا كان موجود
    if (searchTerm) {
      whereCondition.property = {
        OR: [
          { title: { contains: searchTerm } },
          { description: { contains: searchTerm } },
          { city: { contains: searchTerm } },
          { district: { contains: searchTerm } }
        ]
      }
    }

    const favorites = await prisma.favorite.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset,
      include: {
        property: {
          include: {
            images: {
              where: { isMain: true },
              take: 1
            },
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                email: true
              }
            }
          }
        }
      }
    })

    // تحضير البيانات للعرض
    const formattedFavorites = favorites.map(favorite => ({
      id: favorite.id,
      addedAt: favorite.createdAt.toISOString(),
      property: {
        id: favorite.property.id,
        title: favorite.property.title,
        description: favorite.property.description,
        price: favorite.property.price.toString(),
        currency: favorite.property.currency,
        area: favorite.property.area,
        bedrooms: favorite.property.bedrooms,
        bathrooms: favorite.property.bathrooms,
        parking: favorite.property.parking,
        furnished: favorite.property.furnished,
        city: favorite.property.city,
        district: favorite.property.district,
        address: favorite.property.address,
        propertyType: favorite.property.propertyType,
        purpose: favorite.property.purpose,
        status: favorite.property.status,
        views: favorite.property.views,
        contactName: favorite.property.contactName,
        contactPhone: favorite.property.contactPhone,
        contactEmail: favorite.property.contactEmail,
        mainImage: favorite.property.images[0]?.url || null,
        createdAt: favorite.property.createdAt.toISOString(),
        owner: {
          name: `${favorite.property.user.firstName} ${favorite.property.user.lastName}`,
          phone: favorite.property.user.phone,
          email: favorite.property.user.email
        }
      }
    }))

    // حساب إجمالي المفضلة
    const totalFavorites = await prisma.favorite.count({
      where: { userId: decoded.userId }
    })

    console.log(`✅ Retrieved ${favorites.length} favorites`)

    return NextResponse.json({
      success: true,
      message: `تم جلب ${favorites.length} عقار من المفضلة`,
      favorites: formattedFavorites,
      total: totalFavorites,
      pagination: {
        limit,
        offset,
        hasMore: (offset + favorites.length) < totalFavorites
      }
    })

  } catch (error) {
    console.error('❌ Favorites fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'حدث خطأ أثناء جلب المفضلة'
      },
      { status: 500 }
    )
  }
}

// DELETE: إزالة عقار من المفضلة
export async function DELETE(request: NextRequest) {
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

    const { propertyId } = await request.json()

    if (!propertyId) {
      return NextResponse.json(
        { success: false, message: 'معرف العقار مطلوب' },
        { status: 400 }
      )
    }

    // التحقق من وجود العقار في المفضلة
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: decoded.userId,
          propertyId: propertyId
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
          userId: decoded.userId,
          propertyId: propertyId
        }
      }
    })

    console.log(`✅ Property ${propertyId} removed from favorites for user ${decoded.userId}`)

    return NextResponse.json({
      success: true,
      message: 'تم إزالة العقار من المفضلة بنجاح'
    })

  } catch (error) {
    console.error('❌ Remove from favorites error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'حدث خطأ أثناء إزالة العقار من المفضلة'
      },
      { status: 500 }
    )
  }
}