import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// جلب عقار واحد
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        _count: {
          select: {
            favorites: true,
            inquiries: true,
          }
        }
      }
    })

    if (!property) {
      return NextResponse.json(
        { message: 'العقار غير موجود' },
        { status: 404 }
      )
    }

    // التأكد من أن المستخدم يملك هذا العقار
    if (property.userId !== decoded.userId) {
      return NextResponse.json(
        { message: 'غير مصرح بالوصول لهذا العقار' },
        { status: 403 }
      )
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { message: 'خطأ في الخادم' },
      { status: 500 }
    )
  }
}

// تحديث عقار
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    // التحقق من وجود العقار وملكية المستخدم له
    const existingProperty = await prisma.property.findUnique({
      where: { id: params.id }
    })

    if (!existingProperty) {
      return NextResponse.json(
        { message: 'العقار غير موجود' },
        { status: 404 }
      )
    }

    if (existingProperty.userId !== decoded.userId) {
      return NextResponse.json(
        { message: 'غير مصرح بتعديل هذا العقار' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    
    // استخراج البيانات
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const currency = formData.get('currency') as string
    const area = parseFloat(formData.get('area') as string)
    const bedrooms = formData.get('bedrooms') ? parseInt(formData.get('bedrooms') as string) : null
    const bathrooms = formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string) : null
    const parking = formData.get('parking') === 'true'
    const furnished = formData.get('furnished') === 'true'
    const city = formData.get('city') as string
    const district = formData.get('district') as string
    const address = formData.get('address') as string
    const propertyType = formData.get('propertyType') as string
    const purpose = formData.get('purpose') as string
    const status = formData.get('status') as string
    const features = formData.get('features') as string
    const contactName = formData.get('contactName') as string
    const contactPhone = formData.get('contactPhone') as string
    const contactEmail = formData.get('contactEmail') as string

    // التحقق من البيانات المطلوبة
    if (!title || !description || !price || !area || !city || !district) {
      return NextResponse.json(
        { message: 'يرجى ملء جميع الحقول المطلوبة' },
        { status: 400 }
      )
    }

    // معالجة الصور الجديدة
    const newImages: string[] = []
    const imageFiles = formData.getAll('images') as File[]
    
    if (imageFiles.length > 0) {
      const uploadsDir = path.join(process.cwd(), 'public/images/properties')
      
      // إنشاء المجلد إذا لم يكن موجوداً
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }

      for (const file of imageFiles) {
        if (file.size > 0) {
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`
          const filePath = path.join(uploadsDir, fileName)
          
          const buffer = Buffer.from(await file.arrayBuffer())
          fs.writeFileSync(filePath, buffer)
          
          newImages.push(`/images/properties/${fileName}`)
        }
      }
    }

    // دمج الصور الموجودة مع الصور الجديدة
    const existingImages = JSON.parse(formData.get('existingImages') as string || '[]')
    
    // تحديث العقار في قاعدة البيانات
    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data: {
        title,
        description,
        price,
        currency: currency as any,
        area,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        city,
        district,
        address,
        propertyType: propertyType as any,
        purpose: purpose as any,
        status: status as any,
        features,
        contactName,
        contactPhone,
        contactEmail,
        updatedAt: new Date(),
      },
      include: {
        images: true,
        _count: {
          select: {
            favorites: true,
            inquiries: true,
          }
        }
      }
    })

    // إضافة الصور الجديدة
    if (newImages.length > 0) {
      await prisma.propertyImage.createMany({
        data: newImages.map((url, index) => ({
          url,
          propertyId: params.id,
          order: existingImages.length + index,
        }))
      })
    }

    return NextResponse.json({
      message: 'تم تحديث العقار بنجاح',
      property: updatedProperty
    })

  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { message: 'خطأ في تحديث العقار' },
      { status: 500 }
    )
  }
}

// حذف عقار
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    // التحقق من وجود العقار وملكية المستخدم له
    const existingProperty = await prisma.property.findUnique({
      where: { id: params.id },
      include: { images: true }
    })

    if (!existingProperty) {
      return NextResponse.json(
        { message: 'العقار غير موجود' },
        { status: 404 }
      )
    }

    if (existingProperty.userId !== decoded.userId) {
      return NextResponse.json(
        { message: 'غير مصرح بحذف هذا العقار' },
        { status: 403 }
      )
    }

    // حذف صور العقار من الخادم
    if (existingProperty.images && existingProperty.images.length > 0) {
      for (const image of existingProperty.images) {
        try {
          const fullPath = path.join(process.cwd(), 'public', image.url)
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath)
          }
        } catch (err) {
          console.error('Error deleting image:', err)
          // لا نوقف العملية في حالة فشل حذف الصورة
        }
      }
    }

    // حذف العقار من قاعدة البيانات
    await prisma.property.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'تم حذف العقار بنجاح'
    })

  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { message: 'خطأ في حذف العقار' },
      { status: 500 }
    )
  }
}

// تحديث حالة العقار فقط (PATCH)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    const { status } = await request.json()

    // التحقق من وجود العقار وملكية المستخدم له
    const existingProperty = await prisma.property.findUnique({
      where: { id: params.id }
    })

    if (!existingProperty) {
      return NextResponse.json(
        { message: 'العقار غير موجود' },
        { status: 404 }
      )
    }

    if (existingProperty.userId !== decoded.userId) {
      return NextResponse.json(
        { message: 'غير مصرح بتعديل حالة هذا العقار' },
        { status: 403 }
      )
    }

    // تحديث حالة العقار فقط
    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            favorites: true,
            inquiries: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'تم تحديث حالة العقار بنجاح',
      property: updatedProperty
    })

  } catch (error) {
    console.error('Error updating property status:', error)
    return NextResponse.json(
      { message: 'خطأ في تحديث حالة العقار' },
      { status: 500 }
    )
  }
}
