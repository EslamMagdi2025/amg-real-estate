// ======================================================
// 🔐 AMG Real Estate - 2FA Login Verification API
// ======================================================
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import jwt from 'jsonwebtoken'
import { authenticator } from 'otplib'
import { z } from 'zod'
import { logUserActivity } from '@/lib/activity-logger'
import UAParser from 'ua-parser-js'

// التحقق من صحة بيانات 2FA
const verify2FASchema = z.object({
  tempToken: z.string().min(1, 'Token مطلوب'),
  code: z.string().min(6, 'كود التحقق يجب أن يكون 6 أرقام').max(6, 'كود التحقق يجب أن يكون 6 أرقام')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔐 2FA Login Verification attempt')

    // التحقق من صحة البيانات
    const validatedData = verify2FASchema.parse(body)

    // فك تشفير الـ temp token
    let decodedToken: any
    try {
      decodedToken = jwt.verify(validatedData.tempToken, process.env.JWT_SECRET || 'fallback-secret')
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى',
          expired: true
        },
        { status: 401 }
      )
    }

    // التحقق من أن هذا temp token للـ 2FA
    if (decodedToken.step !== '2fa_verification') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Token غير صحيح'
        },
        { status: 401 }
      )
    }

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        userType: true,
        verified: true,
        active: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
        createdAt: true
      }
    })

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'المستخدم غير موجود أو 2FA غير مفعل'
        },
        { status: 401 }
      )
    }

    // التحقق من كود 2FA
    const isValidCode = authenticator.verify({
      token: validatedData.code,
      secret: user.twoFactorSecret
    })

    if (!isValidCode) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'كود التحقق غير صحيح. تأكد من الكود في تطبيق Google Authenticator',
          field: 'code'
        },
        { status: 401 }
      )
    }

    // ✅ كود 2FA صحيح، إنشاء الجلسة الكاملة

    // إنشاء JWT token نهائي
    const finalToken = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        userType: user.userType
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // إنشاء جلسة جديدة
    const userAgent = request.headers.get('user-agent') || ''
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Simple device detection (مبسط)
    const isMobile = userAgent.toLowerCase().includes('mobile')
    const isTablet = userAgent.toLowerCase().includes('tablet')
    const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
    
    const browser = userAgent.includes('Chrome') ? 'Chrome' :
                   userAgent.includes('Firefox') ? 'Firefox' :
                   userAgent.includes('Safari') ? 'Safari' : 'Unknown'

    // Create session record
    const session = await prisma.userSession.create({
      data: {
        userId: user.id,
        deviceName: 'Unknown Device',
        deviceType: deviceType,
        browser: browser,
        ipAddress: ip,
        isActive: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    })

    console.log('✅ User logged in successfully with 2FA verification:', user.id)

    // إعداد الكوكي
    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح مع التحقق الثنائي',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        userType: user.userType,
        verified: user.verified,
        createdAt: user.createdAt
      }
    })

    // تعيين الكوكي
    response.cookies.set('auth-token', finalToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error('❌ 2FA Login verification error:', error)
    
    let errorMessage = 'حدث خطأ أثناء التحقق من الكود'
    
    if (error instanceof z.ZodError) {
      errorMessage = error.issues[0]?.message || errorMessage
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage
      },
      { status: 500 }
    )
  }
}