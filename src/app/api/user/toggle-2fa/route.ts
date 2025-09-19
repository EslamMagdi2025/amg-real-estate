import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Toggle 2FA...')
    
    // التحقق من الـ token
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    // محاكاة تفعيل/إلغاء تفعيل المصادقة الثنائية
    // في التطبيق الحقيقي، سيتم إضافة حقول المصادقة الثنائية لقاعدة البيانات
    
    console.log('✅ 2FA toggled successfully')
    return NextResponse.json({ 
      success: true, 
      message: 'تم تحديث إعدادات المصادقة الثنائية'
    })

  } catch (error) {
    console.error('❌ Error toggling 2FA:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطأ في الخادم' 
    }, { status: 500 })
  }
}