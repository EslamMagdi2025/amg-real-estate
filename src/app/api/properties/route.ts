import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const prisma = new PrismaClient()

// Validation schema
const propertySchema = z.object({
  title: z.string().min(1, 'عنوان العقار مطلوب'),
  description: z.string().min(10, 'وصف العقار يجب أن يكون 10 أحرف على الأقل'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'السعر غير صحيح'),
  currency: z.enum(['EGP', 'USD']),
  area: z.string().regex(/^\d+$/, 'المساحة يجب أن تكون رقم'),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  parking: z.string().optional(),
  furnished: z.string().optional(),
  city: z.string().min(1, 'المدينة مطلوبة'),
  district: z.string().min(1, 'المنطقة مطلوبة'),
  address: z.string().min(1, 'العنوان مطلوب'),
  propertyType: z.enum(['APARTMENT', 'VILLA', 'OFFICE', 'COMMERCIAL', 'LAND']),
  purpose: z.enum(['SALE', 'RENT']),
  features: z.string().optional(),
  contactName: z.string().min(1, 'اسم جهة التواصل مطلوب'),
  contactPhone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  contactEmail: z.string().email('البريد الإلكتروني غير صحيح'),
})

// Get user from JWT token
async function getUserFromToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })
    return user
  } catch (error) {
    return null
  }
}

// Save uploaded file
async function saveFile(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Create unique filename
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const extension = file.name.split('.').pop()
  const filename = `property-${timestamp}-${randomStr}.${extension}`

  // Ensure upload directory exists
  const uploadDir = join(process.cwd(), 'public', 'images', folder)
  console.log('Creating upload directory:', uploadDir)
  
  try {
    await mkdir(uploadDir, { recursive: true })
    console.log('Directory created successfully')
  } catch (error) {
    console.log('Directory creation error (might already exist):', error)
  }

  // Save file
  const filepath = join(uploadDir, filename)
  console.log('Saving file to:', filepath)
  await writeFile(filepath, buffer)

  // Return relative path for database storage
  return `/images/${folder}/${filename}`
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/properties - Request received')
    
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value
    console.log('Auth token present:', !!token)
    
    if (!token) {
      console.log('No auth token found in request')
      return NextResponse.json(
        { message: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    // Get user
    const user = await getUserFromToken(token)
    console.log('User from token:', user ? `${user.firstName} ${user.lastName}` : 'null')
    
    if (!user) {
      console.log('Invalid user from token')
      return NextResponse.json(
        { message: 'مستخدم غير صالح' },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    console.log('Form data received')
    
    // Extract form fields
    const data: any = {}
    const images: File[] = []

    for (const [key, value] of formData.entries()) {
      if (key === 'images' && value instanceof File) {
        images.push(value)
      } else if (typeof value === 'string') {
        data[key] = value
      }
    }

    console.log('Extracted data:', data)
    console.log('Number of images:', images.length)

    // Validate data
    const validatedData = propertySchema.parse(data)

    // Prepare property data
    const propertyData = {
      title: validatedData.title.trim(),
      description: validatedData.description.trim(),
      price: parseFloat(validatedData.price),
      currency: validatedData.currency,
      area: parseInt(validatedData.area),
      bedrooms: validatedData.bedrooms && validatedData.bedrooms !== '' ? parseInt(validatedData.bedrooms) : null,
      bathrooms: validatedData.bathrooms && validatedData.bathrooms !== '' ? parseInt(validatedData.bathrooms) : null,
      parking: validatedData.parking === 'true',
      furnished: validatedData.furnished === 'true',
      city: validatedData.city.trim(),
      district: validatedData.district.trim(),
      address: validatedData.address.trim(),
      propertyType: validatedData.propertyType,
      purpose: validatedData.purpose,
      features: validatedData.features ? validatedData.features.trim() : null,
      contactName: validatedData.contactName.trim(),
      contactPhone: validatedData.contactPhone.trim(),
      contactEmail: validatedData.contactEmail.trim(),
      userId: user.id,
    }

    // Create property
    const property = await prisma.property.create({
      data: propertyData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    })

    // Save images if any
    if (images.length > 0) {
      const imagePromises = images.map(async (image, index) => {
        const imagePath = await saveFile(image, 'properties')
        return prisma.propertyImage.create({
          data: {
            url: imagePath,
            alt: `${property.title} - صورة ${index + 1}`,
            isMain: index === 0, // First image is main
            order: index,
            propertyId: property.id,
          }
        })
      })

      await Promise.all(imagePromises)
    }

    // Get complete property with images
    const completeProperty = await prisma.property.findUnique({
      where: { id: property.id },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'تم إضافة العقار بنجاح',
      property: completeProperty
    })

  } catch (error) {
    console.error('Error creating property:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'بيانات غير صحيحة', errors: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'حدث خطأ في إضافة العقار' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { message: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    // Get user
    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json(
        { message: 'مستخدم غير صالح' },
        { status: 401 }
      )
    }

    // Get user's properties
    const properties = await prisma.property.findMany({
      where: {
        userId: user.id
      },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            favorites: true,
            inquiries: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ properties })

  } catch (error) {
    console.error('Error fetching user properties:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في جلب العقارات' },
      { status: 500 }
    )
  }
}
