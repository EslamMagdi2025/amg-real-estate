import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import UAParser from 'ua-parser-js'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log('📱 Fetching active sessions...')
    
    // التحقق من الـ token
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    // جلب الجلسات النشطة من قاعدة البيانات
    const sessions = await prisma.userSession.findMany({
      where: {
        userId: decoded.userId,
        isActive: true
      },
      orderBy: {
        lastActivity: 'desc'
      },
      select: {
        id: true,
        deviceName: true,
        deviceType: true,
        browser: true,
        os: true,
        ipAddress: true,
        location: true,
        country: true,
        city: true,
        lastActivity: true,
        createdAt: true
      }
    })

    console.log('✅ Active sessions fetched:', sessions.length)
    return NextResponse.json({ 
      success: true, 
      data: sessions 
    })

  } catch (error) {
    console.error('❌ Error fetching sessions:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطأ في الخادم' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Creating new session...')
    
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const userAgent = request.headers.get('user-agent') || ''
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Simple device detection
    const isMobile = /Mobi|Android/i.test(userAgent)
    const isTablet = /Tablet|iPad/i.test(userAgent)
    const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
    
    const browser = userAgent.includes('Chrome') ? 'Chrome' :
                   userAgent.includes('Firefox') ? 'Firefox' :
                   userAgent.includes('Safari') ? 'Safari' : 'Unknown'

    // Create new session
    const newSession = await prisma.userSession.create({
      data: {
        userId: decoded.userId,
        deviceName: 'Unknown Device',
        deviceType: deviceType,
        browser: browser,
        os: 'Unknown OS',
        ipAddress: Array.isArray(ip) ? ip[0] : ip,
        lastActivity: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    })

    console.log('✅ New session created')
    return NextResponse.json({ 
      success: true, 
      data: newSession 
    })

  } catch (error) {
    console.error('❌ Error creating session:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطأ في الخادم' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🚪 Terminating session...')
    
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const { sessionId, terminateAll } = await request.json()

    if (terminateAll) {
      // إنهاء جميع الجلسات عدا الحالية
      await prisma.userSession.updateMany({
        where: {
          userId: decoded.userId,
          isActive: true,
          NOT: {
            sessionToken: token // Keep current session
          }
        },
        data: {
          isActive: false
        }
      })

      console.log('✅ All other sessions terminated')
      return NextResponse.json({ 
        success: true, 
        message: 'تم إنهاء جميع الجلسات الأخرى' 
      })
    } else if (sessionId) {
      // إنهاء جلسة محددة
      await prisma.userSession.update({
        where: {
          id: sessionId,
          userId: decoded.userId
        },
        data: {
          isActive: false
        }
      })

      console.log('✅ Session terminated')
      return NextResponse.json({ 
        success: true, 
        message: 'تم إنهاء الجلسة' 
      })
    }

    return NextResponse.json({ success: false, message: 'طلب غير صحيح' }, { status: 400 })

  } catch (error) {
    console.error('❌ Error terminating session:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'خطأ في الخادم' 
    }, { status: 500 })
  }
}