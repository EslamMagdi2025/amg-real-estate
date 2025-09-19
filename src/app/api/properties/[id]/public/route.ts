import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// API لجلب بيانات العقار للعرض العام
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id

    // جلب بيانات العقار مع الصور
    const property = await prisma.property.findUnique({
      where: { 
        id: propertyId,
        reviewStatus: 'APPROVED' // فقط العقارات المعتمدة
      },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userType: true,
            verified: true,
            createdAt: true
          }
        },
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
        { success: false, message: 'العقار غير موجود أو غير متاح' },
        { status: 404 }
      )
    }

    // تنسيق البيانات للعرض
    const formattedProperty = {
      id: property.id,
      title: property.title,
      description: property.description,
      price: Number(property.price),
      currency: property.currency,
      area: property.area,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      parking: property.parking,
      furnished: property.furnished,
      city: property.city,
      district: property.district,
      address: property.address,
      latitude: property.latitude,
      longitude: property.longitude,
      propertyType: property.propertyType,
      purpose: property.purpose,
      features: property.features ? property.features.split(',').map(f => f.trim()) : [],
      views: property.views,
      contactName: property.contactName,
      contactPhone: property.contactPhone,
      contactEmail: property.contactEmail,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
      images: property.images.map(img => ({
        id: img.id,
        url: img.url,
        alt: img.alt || property.title,
        isMain: img.isMain,
        order: img.order
      })),
      owner: {
        id: property.user.id,
        firstName: property.user.firstName,
        lastName: property.user.lastName,
        userType: property.user.userType,
        verified: property.user.verified,
        memberSince: property.user.createdAt
      },
      stats: {
        views: property.views,
        favorites: property._count.favorites,
        inquiries: property._count.inquiries
      }
    }

    return NextResponse.json({
      success: true,
      data: formattedProperty
    })

  } catch (error) {
    console.error('Error fetching public property:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'خطأ في جلب بيانات العقار',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}