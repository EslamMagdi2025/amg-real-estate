import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import { prisma } from '@/lib/db'

// تفعيل المصادقة الثنائية - الخطوة الأولى
export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Enable 2FA - Step 1: Generate Secret...')
    
    // التحقق من الـ token
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const userId = decoded.userId

    // جلب بيانات المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        twoFactorSecret: true,
        twoFactorEnabled: true
      }
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'المستخدم غير موجود' }, { status: 404 })
    }

    // إذا كان 2FA مفعل بالفعل
    if (user.twoFactorEnabled) {
      return NextResponse.json({ 
        success: false, 
        message: 'المصادقة الثنائية مفعلة بالفعل' 
      }, { status: 400 })
    }

    // إنشاء secret جديد
    const secret = speakeasy.generateSecret({
      name: `AMG Real Estate (${user.email})`,
      issuer: 'AMG Real Estate',
      length: 32
    })

    // إنشاء QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!)

    // حفظ الـ secret مؤقتاً (لن يتم تفعيل 2FA حتى يتم التحقق)
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret.base32 // حفظ مؤقت
      }
    })

    console.log('✅ 2FA secret generated successfully')

    return NextResponse.json({ 
      success: true, 
      data: {
        secret: secret.base32,
        qrCode: qrCodeUrl,
        backupCodes: generateBackupCodes(), // كودات احتياطية
        setupInstructions: [
          'افتح تطبيق Google Authenticator أو أي تطبيق TOTP آخر',
          'امسح رمز QR أو أدخل المفتاح السري يدوياً',
          'أدخل الرمز المكون من 6 أرقام لتأكيد التفعيل'
        ]
      }
    })

  } catch (error) {
    console.error('❌ Error enabling 2FA:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطأ في الخادم' 
    }, { status: 500 })
  }
}

// تأكيد تفعيل المصادقة الثنائية - الخطوة الثانية
export async function PUT(request: NextRequest) {
  try {
    console.log('🔐 Enable 2FA - Step 2: Verify Token...')
    
    // التحقق من الـ token
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const userId = decoded.userId

    const body = await request.json()
    const { verificationCode } = body

    if (!verificationCode || verificationCode.length !== 6) {
      return NextResponse.json({ 
        success: false, 
        message: 'رمز التحقق مطلوب ويجب أن يكون 6 أرقام' 
      }, { status: 400 })
    }

    // جلب المستخدم مع الـ secret
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        twoFactorSecret: true,
        twoFactorEnabled: true
      }
    })

    if (!user || !user.twoFactorSecret) {
      return NextResponse.json({ 
        success: false, 
        message: 'لم يتم إنشاء مفتاح المصادقة الثنائية' 
      }, { status: 400 })
    }

    // التحقق من الرمز
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: verificationCode,
      window: 2 // يسمح بـ ±2 دقائق
    })

    if (!verified) {
      return NextResponse.json({ 
        success: false, 
        message: 'رمز التحقق غير صحيح' 
      }, { status: 400 })
    }

    // تفعيل المصادقة الثنائية
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        updatedAt: new Date()
      }
    })

    // تسجيل النشاط
    try {
      const userAgent = request.headers.get('user-agent') || 'Unknown'
      const ip = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'Unknown'

      await prisma.userActivity.create({
        data: {
          userId,
          action: '2FA_ENABLED',
          details: 'تم تفعيل المصادقة الثنائية (2FA) بنجاح',
          ipAddress: ip,
          userAgent: userAgent
        }
      })
    } catch (activityError) {
      console.error('Error logging activity:', activityError)
    }

    console.log('✅ 2FA enabled successfully')

    return NextResponse.json({ 
      success: true, 
      message: 'تم تفعيل المصادقة الثنائية بنجاح',
      data: {
        enabled: true,
        backupCodes: generateBackupCodes()
      }
    })

  } catch (error) {
    console.error('❌ Error verifying 2FA:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطأ في الخادم' 
    }, { status: 500 })
  }
}

// إلغاء تفعيل المصادقة الثنائية
export async function DELETE(request: NextRequest) {
  try {
    console.log('🔐 Disable 2FA...')
    
    // التحقق من الـ token
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const userId = decoded.userId

    const body = await request.json()
    const { password, verificationCode } = body

    if (!password) {
      return NextResponse.json({ 
        success: false, 
        message: 'كلمة المرور مطلوبة لإلغاء تفعيل المصادقة الثنائية' 
      }, { status: 400 })
    }

    // جلب المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
        twoFactorSecret: true,
        twoFactorEnabled: true
      }
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'المستخدم غير موجود' }, { status: 404 })
    }

    if (!user.twoFactorEnabled) {
      return NextResponse.json({ 
        success: false, 
        message: 'المصادقة الثنائية غير مفعلة' 
      }, { status: 400 })
    }

    // التحقق من كلمة المرور
    const bcrypt = require('bcryptjs')
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ 
        success: false, 
        message: 'كلمة المرور غير صحيحة' 
      }, { status: 400 })
    }

    // التحقق من رمز 2FA إذا تم توفيره
    if (verificationCode) {
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret!,
        encoding: 'base32',
        token: verificationCode,
        window: 2
      })

      if (!verified) {
        return NextResponse.json({ 
          success: false, 
          message: 'رمز التحقق غير صحيح' 
        }, { status: 400 })
      }
    }

    // إلغاء تفعيل المصادقة الثنائية
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        updatedAt: new Date()
      }
    })

    // تسجيل النشاط
    try {
      const userAgent = request.headers.get('user-agent') || 'Unknown'
      const ip = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'Unknown'

      await prisma.userActivity.create({
        data: {
          userId,
          action: '2FA_DISABLED',
          details: 'تم إلغاء تفعيل المصادقة الثنائية (2FA)',
          ipAddress: ip,
          userAgent: userAgent
        }
      })
    } catch (activityError) {
      console.error('Error logging activity:', activityError)
    }

    console.log('✅ 2FA disabled successfully')

    return NextResponse.json({ 
      success: true, 
      message: 'تم إلغاء تفعيل المصادقة الثنائية بنجاح'
    })

  } catch (error) {
    console.error('❌ Error disabling 2FA:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطأ في الخادم' 
    }, { status: 500 })
  }
}

// دالة لتوليد كودات احتياطية
function generateBackupCodes(): string[] {
  const codes: string[] = []
  for (let i = 0; i < 8; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    codes.push(code)
  }
  return codes
}