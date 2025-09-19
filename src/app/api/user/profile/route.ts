// ======================================================
// 👤 AMG Real Estate - User Profile API
// ======================================================
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { logProfileUpdate, logPasswordChange } from '@/lib/activity-logger'
import { getMembershipInfo, calculateTrustScore } from '@/lib/membership-system'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Schema لتحديث الملف الشخصي
const profileUpdateSchema = z.object({
  firstName: z.string().min(2, 'الاسم الأول يجب أن يكون على الأقل حرفين'),
  lastName: z.string().min(2, 'الاسم الأخير يجب أن يكون على الأقل حرفين'),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  userType: z.enum(['INDIVIDUAL', 'AGENT', 'COMPANY', 'ADMIN']).optional()
})

// Schema لتغيير كلمة المرور
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
  newPassword: z.string().min(8, 'كلمة المرور الجديدة يجب أن تكون على الأقل 8 أحرف'),
  confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
})

// GET: جلب معلومات الملف الشخصي المفصلة
export async function GET(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح - تسجيل الدخول مطلوب' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'رمز غير صحيح' },
        { status: 401 }
      )
    }

    console.log(`👤 Fetching profile for user ${decoded.userId}`)

    // جلب معلومات المستخدم مع الإحصائيات التفصيلية
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        userType: true,
        verified: true,
        emailVerified: true,
        phoneVerified: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        // إحصائيات العقارات
        _count: {
          select: {
            properties: true,
            favorites: true,
            inquiries: true
          }
        },
        // العقارات مع تفاصيل أكثر
        properties: {
          select: {
            id: true,
            title: true,
            status: true,
            views: true,
            createdAt: true,
            _count: {
              select: {
                favorites: true,
                inquiries: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // أحدث 5 عقارات فقط
        },
        // التقييمات الواردة للمستخدم
        reviews_reviews_targetIdTousers: {
          select: {
            id: true,
            rating: true,
            comment: true,
            communication: true,
            reliability: true,
            professionalism: true,
            createdAt: true,
            users_reviews_authorIdTousers: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // حساب إحصائيات التقييمات
    const reviews = user.reviews_reviews_targetIdTousers
    const reviewStats = reviews.length > 0 ? {
      count: reviews.length,
      averageRating: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
      averageCommunication: reviews.filter(r => r.communication).reduce((sum, r) => sum + (r.communication || 0), 0) / reviews.filter(r => r.communication).length || 0,
      averageReliability: reviews.filter(r => r.reliability).reduce((sum, r) => sum + (r.reliability || 0), 0) / reviews.filter(r => r.reliability).length || 0,
      averageProfessionalism: reviews.filter(r => r.professionalism).reduce((sum, r) => sum + (r.professionalism || 0), 0) / reviews.filter(r => r.professionalism).length || 0,
      recent: reviews.slice(0, 3).map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        communication: r.communication,
        reliability: r.reliability,
        professionalism: r.professionalism,
        author: {
          name: `${r.users_reviews_authorIdTousers.firstName} ${r.users_reviews_authorIdTousers.lastName}`,
          avatar: r.users_reviews_authorIdTousers.avatar
        },
        createdAt: r.createdAt.toISOString()
      }))
    } : {
      count: 0,
      averageRating: null,
      averageCommunication: null,
      averageReliability: null,
      averageProfessionalism: null,
      recent: []
    }

    // حساب إحصائيات متقدمة
    const propertyStats = {
      total: user._count.properties,
      active: user.properties.filter(p => p.status === 'ACTIVE').length,
      pending: user.properties.filter(p => p.status === 'PENDING').length,
      sold: user.properties.filter(p => p.status === 'SOLD').length,
      rented: user.properties.filter(p => p.status === 'RENTED').length,
      totalViews: user.properties.reduce((sum, p) => sum + p.views, 0),
      totalFavorites: user.properties.reduce((sum, p) => sum + p._count.favorites, 0),
      totalInquiries: user.properties.reduce((sum, p) => sum + p._count.inquiries, 0)
    }

    // تحضير البيانات للعرض
    const profileData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      userType: user.userType,
      verified: user.verified,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      active: user.active,
      memberSince: user.createdAt.toISOString(),
      lastUpdated: user.updatedAt.toISOString(),
      stats: {
        properties: propertyStats,
        favorites: user._count.favorites,
        inquiries: user._count.inquiries,
        reviews: reviewStats
      },
      recentProperties: user.properties.map(p => ({
        id: p.id,
        title: p.title,
        status: p.status,
        views: p.views,
        favorites: p._count.favorites,
        inquiries: p._count.inquiries,
        createdAt: p.createdAt.toISOString()
      }))
    }

    console.log(`✅ Profile fetched for user ${decoded.userId}`)

    // حساب بيانات العضوية والخبرة
    const membershipData = {
      userType: user.userType,
      verified: user.verified,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      identityDocumentVerified: false, // سيتم تحديثها لاحقاً
      addressProofVerified: false, // سيتم تحديثها لاحقاً
      completedTransactions: propertyStats.sold + propertyStats.rented,
      averageRating: reviewStats.averageRating || 0,
      reviewCount: reviewStats.count || 0,
      trustScore: 0, // سيتم حسابها
      createdAt: user.createdAt,
      premiumUntil: undefined
    }

    // حساب نقاط الثقة
    membershipData.trustScore = calculateTrustScore(membershipData)

    // حساب مستويات العضوية والخبرة
    const membershipInfo = getMembershipInfo(membershipData)

    // إضافة معلومات العضوية للبيانات المرسلة
    const enhancedProfileData = {
      ...profileData,
      membership: {
        level: membershipInfo.membershipLevel,
        levelData: membershipInfo.membershipData,
        experience: membershipInfo.experienceLevel,
        experienceData: membershipInfo.experienceData,
        trustScore: membershipInfo.trustScore,
        progress: membershipInfo.progress
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم جلب الملف الشخصي بنجاح',
      data: enhancedProfileData
    })

  } catch (error) {
    console.error('❌ Profile fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'حدث خطأ أثناء جلب الملف الشخصي'
      },
      { status: 500 }
    )
  }
}

// PUT: تحديث معلومات الملف الشخصي
export async function PUT(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح - تسجيل الدخول مطلوب' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'رمز غير صحيح' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // التحقق من نوع التحديث
    if (body.action === 'update_profile') {
      // تحديث معلومات الملف الشخصي
      const validatedData = profileUpdateSchema.parse(body.data)

      // الحصول على البيانات القديمة للمقارنة
      const oldUser = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          userType: true
        }
      })

      // تحديث المستخدم
      const updatedUser = await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          phone: validatedData.phone || null,
          avatar: validatedData.avatar || null,
          ...(validatedData.userType && { userType: validatedData.userType })
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          avatar: true,
          userType: true
        }
      })

      // تسجيل النشاط مع التغييرات
      const changes = {
        firstName: oldUser?.firstName !== validatedData.firstName ? {
          from: oldUser?.firstName, 
          to: validatedData.firstName
        } : undefined,
        lastName: oldUser?.lastName !== validatedData.lastName ? {
          from: oldUser?.lastName, 
          to: validatedData.lastName
        } : undefined,
        phone: oldUser?.phone !== (validatedData.phone || null) ? {
          from: oldUser?.phone, 
          to: validatedData.phone
        } : undefined,
        userType: oldUser?.userType !== validatedData.userType ? {
          from: oldUser?.userType, 
          to: validatedData.userType
        } : undefined
      }

      // إزالة القيم غير المعرفة
      Object.keys(changes).forEach(key => {
        if (changes[key as keyof typeof changes] === undefined) {
          delete (changes as any)[key]
        }
      })

      if (Object.keys(changes).length > 0) {
        // Type safe way to call logProfileUpdate
        const safeChanges: Record<string, { from: any, to: any }> = {}
        Object.entries(changes).forEach(([key, value]) => {
          if (value) {
            safeChanges[key] = value
          }
        })
        await logProfileUpdate(decoded.userId, safeChanges, request)
      }

      console.log(`✅ Profile updated for user ${decoded.userId}`)

      return NextResponse.json({
        success: true,
        message: 'تم تحديث الملف الشخصي بنجاح',
        data: updatedUser
      })

    } else if (body.action === 'change_password') {
      // تغيير كلمة المرور
      const validatedData = passwordChangeSchema.parse(body.data)

      // التحقق من كلمة المرور الحالية
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { password: true }
      })

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'المستخدم غير موجود' },
          { status: 404 }
        )
      }

      const isValidPassword = await bcrypt.compare(
        validatedData.currentPassword, 
        user.password
      )

      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, message: 'كلمة المرور الحالية غير صحيحة' },
          { status: 400 }
        )
      }

      // تشفير كلمة المرور الجديدة
      const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 12)

      // تحديث كلمة المرور
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { password: hashedNewPassword }
      })

      // تسجيل النشاط
      await logPasswordChange(decoded.userId, request)

      console.log(`✅ Password changed for user ${decoded.userId}`)

      return NextResponse.json({
        success: true,
        message: 'تم تغيير كلمة المرور بنجاح'
      })

    } else {
      return NextResponse.json(
        { success: false, message: 'نوع العملية غير صحيح' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('❌ Profile update error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'بيانات غير صحيحة', 
          errors: error.issues 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'حدث خطأ أثناء تحديث الملف الشخصي'
      },
      { status: 500 }
    )
  }
}