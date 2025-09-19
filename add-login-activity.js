const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addLoginActivity() {
  try {
    console.log('🔍 البحث عن المستخدم الحالي...')
    
    // العثور على المستخدم الحالي
    const user = await prisma.user.findUnique({
      where: {
        email: 'eslam480@outlook.com'
      }
    })
    
    if (!user) {
      console.log('❌ لم يتم العثور على المستخدم')
      return
    }
    
    console.log(`✅ تم العثور على المستخدم: ${user.firstName} ${user.lastName}`)
    
    // إضافة نشاط دخول جديد
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        activityType: 'LOGIN',
        entityType: 'USER',
        title: 'تسجيل دخول',
        description: 'قام المستخدم بتسجيل الدخول إلى dashboard',
        createdAt: new Date()
      }
    })
    
    console.log('✅ تم إضافة نشاط دخول جديد!')
    
    // عرض آخر الأنشطة
    const activities = await prisma.userActivity.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    })
    
    console.log('📊 آخر 3 أنشطة:')
    activities.forEach((activity, index) => {
      console.log(`${index + 1}. ${activity.title} - ${activity.createdAt.toLocaleString()}`)
    })
    
  } catch (error) {
    console.error('❌ خطأ في إضافة النشاط:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addLoginActivity()