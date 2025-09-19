import { NextRequest, NextResponse } from 'next/server'
import { checkPasswordStrength } from '@/lib/password-strength'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json({ 
        success: false, 
        message: 'كلمة المرور مطلوبة' 
      }, { status: 400 })
    }

    const strength = checkPasswordStrength(password)

    return NextResponse.json({ 
      success: true, 
      data: strength
    })

  } catch (error) {
    console.error('❌ Error checking password strength:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطأ في الخادم' 
    }, { status: 500 })
  }
}