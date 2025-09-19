import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { z } from 'zod'
import { logUserActivity } from '@/lib/activity-logger'

// schema للتحقق من بيانات الاستفسار
const inquirySchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  message: z.string().min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل'),
  propertyId: z.string().optional(),
  subject: z.string().optional().default('استفسار عن عقار')
})

// إنشاء استفسار جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // التحقق من صحة البيانات
    const validatedData = inquirySchema.parse(body)

    // التحقق من العقار إذا تم تحديد معرف
    if (validatedData.propertyId) {
      const property = await prisma.property.findUnique({
        where: { 
          id: validatedData.propertyId,
          reviewStatus: 'APPROVED' 
        },
        select: { id: true, title: true, userId: true }
      })

      if (!property) {
        return NextResponse.json(
          { success: false, message: 'العقار غير موجود' },
          { status: 404 }
        )
      }
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
        console.log('No valid user token for inquiry')
      }
    }

    // إنشاء الاستفسار
    const inquiry = await prisma.inquiry.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        subject: validatedData.subject,
        message: validatedData.message,
        inquiryType: validatedData.propertyId ? 'PROPERTY' : 'GENERAL',
        status: 'PENDING',
        userId: userId,
        propertyId: validatedData.propertyId
      },
      include: {
        property: {
          select: { title: true }
        }
      }
    })

    // تسجيل النشاط إذا كان المستخدم مسجل دخوله
    if (userId) {
      try {
        await logUserActivity({
          userId,
          activityType: 'INQUIRY_CREATE',
          entityType: 'INQUIRY',
          entityId: inquiry.id,
          title: 'إرسال استفسار',
          description: validatedData.propertyId 
            ? `إرسال استفسار عن عقار: ${inquiry.property?.title}`
            : 'إرسال استفسار عام',
          metadata: {
            inquiryId: inquiry.id,
            propertyId: validatedData.propertyId,
            propertyTitle: inquiry.property?.title,
            subject: validatedData.subject
          },
          request
        })
      } catch (activityError) {
        console.error('Error logging inquiry activity:', activityError)
        // لا نريد أن نفشل العملية كاملة بسبب خطأ في تسجيل النشاط
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال الاستفسار بنجاح. سنتواصل معك في أقرب وقت.',
      inquiryId: inquiry.id
    })

  } catch (error) {
    console.error('Error creating inquiry:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'بيانات غير صحيحة',
          errors: error.issues.map((issue: any) => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'خطأ في إرسال الاستفسار. حاول مرة أخرى.',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

// جلب الاستفسارات (للمستخدم المسجل دخوله)
export async function GET(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const jwt = await import('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const userId = decoded.userId

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // جلب الاستفسارات
    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where: { userId },
        include: {
          property: {
            select: { id: true, title: true, price: true, currency: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.inquiry.count({
        where: { userId }
      })
    ])

    return NextResponse.json({
      success: true,
      data: {
        inquiries,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'خطأ في جلب الاستفسارات',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}