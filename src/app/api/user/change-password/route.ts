import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { checkPasswordStrength } from '@/lib/password-strength'

export async function POST(request: NextRequest) {
  try {
    console.log('🔒 Change password request...')
    
    // التحقق من الـ token
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const userId = decoded.userId

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ 
        success: false, 
        message: 'كلمة المرور الحالية والجديدة مطلوبتان' 
      }, { status: 400 })
    }

    // فحص قوة كلمة المرور الجديدة
    const passwordStrength = checkPasswordStrength(newPassword)
    if (!passwordStrength.isValid) {
      return NextResponse.json({ 
        success: false, 
        message: 'كلمة المرور الجديدة لا تلبي متطلبات الأمان',
        feedback: passwordStrength.feedback
      }, { status: 400 })
    }

    // جلب المستخدم مع تاريخ كلمات المرور
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
        passwordHistory: true,
        lastPasswordChange: true
      }
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'المستخدم غير موجود' }, { status: 404 })
    }

    // التحقق من كلمة المرور الحالية
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ 
        success: false, 
        message: 'كلمة المرور الحالية غير صحيحة' 
      }, { status: 400 })
    }

    // التحقق من عدم إعادة استخدام كلمات المرور السابقة
    const passwordHistory = (user.passwordHistory as string[]) || []
    
    // فحص كلمة المرور الحالية
    const isSameAsCurrent = await bcrypt.compare(newPassword, user.password)
    if (isSameAsCurrent) {
      return NextResponse.json({ 
        success: false, 
        message: 'لا يمكن استخدام كلمة المرور الحالية' 
      }, { status: 400 })
    }

    // فحص آخر 5 كلمات مرور
    for (const oldPassword of passwordHistory.slice(-5)) {
      const isSameAsOld = await bcrypt.compare(newPassword, oldPassword)
      if (isSameAsOld) {
        return NextResponse.json({ 
          success: false, 
          message: 'لا يمكن إعادة استخدام كلمة مرور استخدمتها من قبل' 
        }, { status: 400 })
      }
    }

    // تشفير كلمة المرور الجديدة
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // تحديث تاريخ كلمات المرور
    const updatedPasswordHistory = [...passwordHistory, user.password].slice(-5) // الاحتفاظ بآخر 5 كلمات مرور

    // تحديث كلمة المرور في قاعدة البيانات
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
        lastPasswordChange: new Date(),
        passwordHistory: updatedPasswordHistory,
        updatedAt: new Date()
      }
    })

    // تسجيل النشاط مع معلومات إضافية
    try {
      const userAgent = request.headers.get('user-agent') || 'Unknown'
      const ip = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'Unknown'

      await prisma.userActivity.create({
        data: {
          userId,
          action: 'PASSWORD_CHANGE',
          details: 'تم تغيير كلمة المرور بنجاح بواسطة المستخدم',
          ipAddress: ip,
          userAgent: userAgent
        }
      })
    } catch (activityError) {
      console.error('Error logging activity:', activityError)
      // لا نريد فشل العملية بسبب عدم تسجيل النشاط
    }

    console.log('✅ Password changed successfully')
    return NextResponse.json({ 
      success: true, 
      message: 'تم تغيير كلمة المرور بنجاح',
      passwordStrength: {
        score: passwordStrength.score,
        label: passwordStrength.score >= 4 ? 'قوي جداً' : 
               passwordStrength.score >= 3 ? 'قوي' : 
               passwordStrength.score >= 2 ? 'متوسط' : 'ضعيف'
      }
    })

  } catch (error) {
    console.error('❌ Error changing password:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطأ في الخادم' 
    }, { status: 500 })
  }
}