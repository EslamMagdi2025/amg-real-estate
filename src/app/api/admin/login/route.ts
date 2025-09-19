// Admin Login API Route
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
// import { AdminAuth } from '@/lib/admin-auth' // سنفعلها لاحقاً

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'اسم المستخدم وكلمة المرور مطلوبان' },
        { status: 400 }
      )
    }

    // TODO: مؤقتاً - نظام login بسيط بدون JWT
    // في المستقبل سنستخدم database lookup
    
    // Default Admin Credentials (مؤقت)
    const defaultAdmins = [
      {
        username: 'admin',
        password: 'admin123',
        role: 'SUPER_ADMIN',
        name: 'Super Admin'
      },
      {
        username: 'moderator',
        password: 'mod123',
        role: 'MODERATOR', 
        name: 'Moderator'
      },
      {
        username: 'eslam',
        password: '123456',
        role: 'SUPER_ADMIN',
        name: 'اسلام مجدي'
      }
    ]

    // Check credentials
    const admin = defaultAdmins.find(
      a => a.username === username && a.password === password
    )

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'بيانات الدخول غير صحيحة' },
        { status: 401 }
      )
    }

    // Success - Create session (مؤقت بدون JWT)
    const sessionData = {
      id: `admin_${Date.now()}`,
      username: admin.username,
      role: admin.role,
      name: admin.name,
      loginTime: new Date().toISOString()
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        admin: sessionData,
        token: `temp_token_${Date.now()}` // مؤقت
      }
    })

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    message: 'طريقة غير مسموحة - استخدم POST'
  }, { status: 405 })
}
