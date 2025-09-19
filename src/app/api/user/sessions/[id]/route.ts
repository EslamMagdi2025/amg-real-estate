import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    console.log('🗑️ Terminating session:', params.id)
    
    // التحقق من الـ token
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    // محاكاة إنهاء الجلسة
    // في التطبيق الحقيقي، سيتم حذف الجلسة من قاعدة البيانات
    
    console.log('✅ Session terminated successfully')
    return NextResponse.json({ 
      success: true, 
      message: 'تم إنهاء الجلسة بنجاح'
    })

  } catch (error) {
    console.error('❌ Error terminating session:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطأ في الخادم' 
    }, { status: 500 })
  }
}