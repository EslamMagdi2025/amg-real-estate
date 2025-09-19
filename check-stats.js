const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkActivityStats() {
  try {
    console.log('📊 فحص إحصائيات النشاط...')
    
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
    
    // إحصائيات النشاط
    const stats = await prisma.userActivity.groupBy({
      by: ['activityType'],
      where: {
        userId: user.id
      },
      _count: {
        activityType: true
      }
    })
    
    console.log('📈 إحصائيات النشاط:')
    stats.forEach(stat => {
      console.log(`${stat.activityType}: ${stat._count.activityType}`)
    })
    
    // عدد الأنشطة الكلي
    const totalActivities = await prisma.userActivity.count({
      where: {
        userId: user.id
      }
    })
    
    console.log(`📝 إجمالي الأنشطة: ${totalActivities}`)
    
    // أحدث نشاط
    const latestActivity = await prisma.userActivity.findFirst({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`🕐 آخر نشاط: ${latestActivity?.title} - ${latestActivity?.createdAt?.toLocaleString()}`)
    
  } catch (error) {
    console.error('❌ خطأ في فحص الإحصائيات:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkActivityStats()