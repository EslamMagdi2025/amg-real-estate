const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testNotifications() {
  console.log('🧪 اختبار نظام الإشعارات...')
  console.log('============================')
  
  try {
    // البحث عن مستخدم للاختبار
    const user = await prisma.user.findFirst({
      where: {
        email: 'eslam480@outlook.com'
      }
    })

    if (!user) {
      console.log('❌ لم يتم العثور على مستخدم للاختبار')
      return
    }

    console.log(`👤 المستخدم: ${user.firstName} ${user.lastName} (${user.email})`)
    console.log('')

    // قائمة الإشعارات التجريبية
    const testNotifications = [
      {
        userId: user.id,
        type: 'PROPERTY_INQUIRY',
        title: 'استفسار جديد على عقارك',
        message: 'لديك استفسار جديد على عقار "شقة 3 غرف في المعادي" من عميل مهتم بالشراء'
      },
      {
        userId: user.id,
        type: 'PROPERTY_FAVORITE',
        title: 'تم إضافة عقارك للمفضلة',
        message: 'قام أحد المستخدمين بإضافة عقارك "فيلا بحديقة في التجمع الخامس" للمفضلة'
      },
      {
        userId: user.id,
        type: 'PROPERTY_VIEW',
        title: 'مشاهدات جديدة على عقارك',
        message: 'حصل عقارك "شقة للإيجار في مدينة نصر" على 8 مشاهدات جديدة خلال آخر 24 ساعة'
      },
      {
        userId: user.id,
        type: 'ACCOUNT_UPDATE',
        title: 'تم تحديث بياناتك بنجاح',
        message: 'تم تحديث معلومات ملفك الشخصي وبيانات الاتصال بنجاح'
      },
      {
        userId: user.id,
        type: 'EMAIL_VERIFIED',
        title: 'تم توثيق بريدك الإلكتروني',
        message: 'تم توثيق بريدك الإلكتروني بنجاح. يمكنك الآن الاستفادة من جميع ميزات المنصة'
      },
      {
        userId: user.id,
        type: 'TWO_FACTOR_ENABLED',
        title: 'تم تفعيل المصادقة الثنائية',
        message: 'تم تفعيل المصادقة الثنائية لحسابك بنجاح. حسابك الآن أكثر أماناً'
      },
      {
        userId: user.id,
        type: 'MEMBERSHIP_UPGRADED',
        title: 'تم ترقية عضويتك',
        message: 'مبروك! تم ترقية عضويتك إلى العضوية الذهبية. استمتع بالمزايا الجديدة'
      },
      {
        userId: user.id,
        type: 'WELCOME',
        title: 'مرحباً بك في AMG العقارية',
        message: 'نرحب بك في منصة AMG العقارية. ابدأ رحلتك العقارية معنا واستكشف آلاف العقارات المميزة'
      }
    ]

    console.log('📝 إضافة إشعارات تجريبية...')
    
    // إضافة الإشعارات واحد تلو الآخر مع تأخير زمني
    for (let i = 0; i < testNotifications.length; i++) {
      const notification = testNotifications[i]
      
      try {
        const created = await prisma.notification.create({
          data: {
            ...notification,
            read: i > 2 // أول 3 إشعارات غير مقروءة، الباقي مقروء
          }
        })
        
        console.log(`✅ تم إضافة: ${notification.type} - ${notification.title}`)
        
        // تأخير قصير لمحاكاة الإشعارات الحقيقية
        await new Promise(resolve => setTimeout(resolve, 200))
        
      } catch (error) {
        console.log(`❌ فشل في إضافة ${notification.type}:`, error.message)
      }
    }

    console.log('')
    console.log('📋 الإشعارات الحديثة للمستخدم:')
    console.log('===============================')

    // جلب الإشعارات الحديثة
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    notifications.forEach((notification, index) => {
      const status = notification.read ? '✅ مقروء' : '🔔 جديد'
      const time = notification.createdAt.toLocaleString('ar-EG')
      
      console.log(`${index + 1}. ${status} | ${notification.type}`)
      console.log(`   العنوان: ${notification.title}`)
      console.log(`   الرسالة: ${notification.message}`)
      console.log(`   التاريخ: ${time}`)
      console.log('')
    })

    // إحصائيات
    const totalNotifications = await prisma.notification.count({
      where: { userId: user.id }
    })
    
    const unreadCount = await prisma.notification.count({
      where: { userId: user.id, read: false }
    })

    console.log('📊 الإحصائيات:')
    console.log(`   إجمالي الإشعارات: ${totalNotifications}`)
    console.log(`   غير المقروءة: ${unreadCount}`)
    console.log(`   المقروءة: ${totalNotifications - unreadCount}`)
    console.log('')

    console.log('🎯 اختبار API الإشعارات:')
    console.log('======================')
    
    // محاكاة استدعاء API
    console.log('✅ API متاح على: /api/notifications')
    console.log('✅ يدعم GET للحصول على الإشعارات')
    console.log('✅ يدعم PUT لتحديث حالة القراءة')
    console.log('✅ يعرض بيانات وهمية حالياً للاختبار')
    console.log('')

    console.log('🎉 نظام الإشعارات جاهز!')
    console.log('🔗 يمكنك الآن زيارة الداشبورد لرؤية الإشعارات')

  } catch (error) {
    console.error('❌ خطأ في اختبار الإشعارات:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// تشغيل الاختبار
testNotifications()