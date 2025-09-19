import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { PropertyStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const propertyType = searchParams.get('propertyType') || ''
    const purpose = searchParams.get('purpose') || ''
    const minPrice = searchParams.get('minPrice') || ''
    const maxPrice = searchParams.get('maxPrice') || ''
    const city = searchParams.get('city') || ''

    const skip = (page - 1) * limit

    // بناء شروط البحث
    const where: any = {
      // عرض العقارات المنشورة والموافق عليها فقط
      status: PropertyStatus.ACTIVE,
      reviewStatus: 'APPROVED'
    }

    // إضافة شرط البحث النصي
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { district: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ]
    }

    // إضافة فلتر النوع
    if (propertyType) {
      where.propertyType = propertyType
    }

    // إضافة فلتر نوع البيع
    if (purpose) {
      where.purpose = purpose
    }

    // إضافة فلتر المدينة
    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    // إضافة فلتر السعر
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) {
        where.price.gte = parseFloat(minPrice)
      }
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice)
      }
    }

    // جلب العقارات مع معلومات المستخدم والصور
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          images: {
            orderBy: { createdAt: 'asc' }
          }
        }
      }),
      prisma.property.count({ where })
    ])

    console.log(`📊 Found ${total} properties matching criteria`)

    return NextResponse.json({
      properties,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    })

  } catch (error) {
    console.error('❌ Error fetching public properties:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب العقارات' },
      { status: 500 }
    )
  }
}