// ======================================================
// 🔐 AMG Real Estate - User Registration API
// ======================================================
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { z } from 'zod'
import { sendVerificationEmail } from '@/lib/email-service'

// التحقق من صحة البيانات
const registerSchema = z.object({
  firstName: z.string().min(2, 'الاسم الأول يجب أن يكون على الأقل حرفين'),
  lastName: z.string().min(2, 'الاسم الأخير يجب أن يكون على الأقل حرفين'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون على الأقل 8 أحرف'),
  userType: z.enum(['INDIVIDUAL', 'COMPANY', 'AGENT']).optional().default('INDIVIDUAL')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📝 Registration attempt:', { email: body.email, firstName: body.firstName })

    // التحقق من صحة البيانات
    const validatedData = registerSchema.parse(body)

    // التحقق من عدم وجود المستخدم مسبقاً
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'هذا البريد الإلكتروني مستخدم بالفعل',
          field: 'email'
        },
        { status: 400 }
      )
    }

    // التحقق من عدم وجود رقم الهاتف مسبقاً
    const existingPhone = await prisma.user.findFirst({
      where: { phone: validatedData.phone }
    })

    if (existingPhone) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'رقم الهاتف مستخدم بالفعل',
          field: 'phone'
        },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // إنشاء رمز توثيق الإيميل
    const emailVerifyToken = crypto.randomBytes(32).toString('hex')
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 ساعة

    // إنشاء المستخدم الجديد
    const newUser = await prisma.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        password: hashedPassword,
        userType: validatedData.userType,
        verified: false, // سيتم التحقق لاحقاً
        emailVerified: false,
        emailVerifyToken: emailVerifyToken,
        verifyTokenExpiry: verifyTokenExpiry,
        active: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        userType: true,
        verified: true,
        createdAt: true
      }
    })

    // إنشاء JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id,
        email: newUser.email,
        userType: newUser.userType
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    console.log('✅ User registered successfully:', newUser.id)

    // إرسال إيميل التوثيق
    try {
      const emailSent = await sendVerificationEmail({
        to: newUser.email,
        name: `${newUser.firstName} ${newUser.lastName}`,
        verifyToken: emailVerifyToken
      });

      if (emailSent) {
        console.log('📧 Verification email sent successfully to:', newUser.email);
      } else {
        console.log('⚠️ Failed to send verification email to:', newUser.email);
      }
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError);
      // لا نريد أن نفشل التسجيل بسبب خطأ في الإيميل
    }

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح! تم إرسال رابط التفعيل إلى بريدك الإلكتروني',
      user: newUser,
      token,
      emailSent: true
    })

  } catch (error) {
    console.error('❌ Registration error:', error)

    // التعامل مع أخطاء التحقق من البيانات
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return NextResponse.json(
        { 
          success: false, 
          message: firstError.message,
          field: firstError.path[0]
        },
        { status: 400 }
      )
    }

    // التعامل مع أخطاء قاعدة البيانات
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'البريد الإلكتروني أو رقم الهاتف مستخدم بالفعل'
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.'
      },
      { status: 500 }
    )
  }
}