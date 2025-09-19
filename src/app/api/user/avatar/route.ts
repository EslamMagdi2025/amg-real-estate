import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بالوصول' },
        { status: 401 }
      )
    }

    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'رمز الدخول غير صالح' },
        { status: 401 }
      )
    }

    const { avatar } = await request.json()

    if (!avatar) {
      return NextResponse.json(
        { success: false, message: 'رابط الصورة مطلوب' },
        { status: 400 }
      )
    }

    // تحديث صورة المستخدم
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { avatar },
      select: {
        id: true,
        avatar: true,
        firstName: true,
        lastName: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'تم تحديث الصورة الشخصية بنجاح'
    })

  } catch (error) {
    console.error('Error updating avatar:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ في تحديث الصورة الشخصية',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}