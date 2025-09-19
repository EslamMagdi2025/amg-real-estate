// ======================================================
// 🔄 AMG Real Estate - Resend Verification Email API
// ======================================================
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      )
    }

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        emailVerified: true,
        verifyTokenExpiry: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'لم يتم العثور على حساب بهذا الإيميل' },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, message: 'الحساب مُفعل بالفعل' },
        { status: 400 }
      )
    }

    // تحقق من آخر إرسال (منع الإرسال المتكرر)
    if (user.verifyTokenExpiry && user.verifyTokenExpiry > new Date()) {
      const timeLeft = Math.ceil((user.verifyTokenExpiry.getTime() - Date.now()) / (1000 * 60))
      return NextResponse.json(
        { 
          success: false, 
          message: `يرجى الانتظار ${timeLeft} دقيقة قبل طلب إيميل جديد` 
        },
        { status: 429 }
      )
    }

    // إنشاء رمز توثيق جديد
    const emailVerifyToken = crypto.randomBytes(32).toString('hex')
    const verifyTokenExpiry = new Date(Date.now() + 60000) // دقيقة واحدة للاختبار (بدلاً من ساعة)

    // تحديث المستخدم
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifyToken,
        verifyTokenExpiry
      }
    })

    // إرسال الإيميل
    try {
      const emailSent = await sendVerificationEmail({
        to: user.email,
        name: `${user.firstName} ${user.lastName}`,
        verifyToken: emailVerifyToken
      })

      if (emailSent) {
        console.log('📧 Verification email resent to:', user.email)
        return NextResponse.json({
          success: true,
          message: 'تم إرسال إيميل التفعيل بنجاح'
        })
      } else {
        return NextResponse.json(
          { success: false, message: 'فشل في إرسال الإيميل. حاول مرة أخرى' },
          { status: 500 }
        )
      }
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError)
      return NextResponse.json(
        { success: false, message: 'خطأ في إرسال الإيميل' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Resend verification error:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}