// ======================================================
// 📧 AMG Real Estate - Email Verification API
// ======================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logEmailVerify } from '@/lib/activity-logger'
import { sendWelcomeEmail, sendVerificationEmail } from '@/lib/email-service'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'رمز التحقق مطلوب' },
        { status: 400 }
      )
    }

    console.log('🔍 التحقق من رمز التفعيل:', token)

    // البحث عن المستخدم بالرمز
    const user = await prisma.user.findFirst({
      where: {
        emailVerifyToken: token,
        verifyTokenExpiry: {
          gte: new Date() // الرمز لم ينته بعد
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'رمز التحقق غير صحيح أو منتهي الصلاحية' },
        { status: 400 }
      )
    }

    // تفعيل البريد الإلكتروني
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verified: true, // تفعيل الحساب عموماً عند تفعيل الإيميل
        emailVerifyToken: null,
        verifyTokenExpiry: null
      }
    })

    console.log('✅ تم تفعيل البريد الإلكتروني للمستخدم:', user.email)

    // تسجيل النشاط
    await logEmailVerify(user.id, request)

    // إرسال إيميل ترحيب
    try {
      await sendWelcomeEmail(user.email, `${user.firstName} ${user.lastName}`);
      console.log('📧 Welcome email sent to:', user.email);
    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'تم تفعيل البريد الإلكتروني بنجاح! مرحباً بك في AMG Real Estate 🎉'
    })

  } catch (error) {
    console.error('❌ خطأ في تفعيل البريد الإلكتروني:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء التفعيل' },
      { status: 500 }
    )
  }
}

// إرسال رابط تفعيل جديد
export async function GET(request: NextRequest) {
  try {
    // هنا يمكن إضافة آلية إعادة إرسال رابط التفعيل
    const searchParams = new URL(request.url).searchParams
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني موثق بالفعل' },
        { status: 400 }
      )
    }

    // إنشاء رمز تفعيل جديد
    const verifyToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 ساعة

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifyToken: verifyToken,
        verifyTokenExpiry: tokenExpiry
      }
    })

    // هنا يمكن إضافة إرسال الإيميل
    console.log(`📧 رابط التفعيل الجديد: http://localhost:3003/verify-email?token=${verifyToken}`)

    // إرسال إيميل التوثيق
    try {
      const emailSent = await sendVerificationEmail({
        to: user.email,
        name: `${user.firstName} ${user.lastName}`,
        verifyToken: verifyToken
      });

      if (!emailSent) {
        console.error('Failed to send verification email');
      }
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رابط التفعيل الجديد إلى بريدك الإلكتروني 📧'
    })

  } catch (error) {
    console.error('❌ خطأ في إعادة إرسال رابط التفعيل:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء الإرسال' },
      { status: 500 }
    )
  }
}