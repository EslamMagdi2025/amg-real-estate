import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('🔒 Fetching security settings...')
    
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
        emailVerified: true,
        phoneVerified: true,
        twoFactorEnabled: true,
        loginNotifications: true,
        securityAlerts: true,
        sessionTimeout: true,
        lastPasswordChange: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'المستخدم غير موجود' }, { status: 404 })
    }

    // عدد الجلسات النشطة (يمكن تحسينه لاحقاً)
    const activeSessions = 1

    const securityData = {
      emailVerified: user.emailVerified || false,
      phoneVerified: user.phoneVerified || false,
      twoFactorEnabled: user.twoFactorEnabled || false,
      loginNotifications: user.loginNotifications !== false, // افتراضي true
      securityAlerts: user.securityAlerts !== false, // افتراضي true
      sessionTimeout: user.sessionTimeout || 30,
      lastPasswordChange: user.lastPasswordChange?.toISOString() || user.createdAt.toISOString(),
      activeSessions
    }

    console.log('✅ Security settings fetched successfully')
    return NextResponse.json({ 
      success: true, 
      data: securityData 
    })

  } catch (error) {
    console.error('❌ Error fetching security settings:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطأ في الخادم' 
    }, { status: 500 })
  }
}