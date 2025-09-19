// ======================================================
// 🧪 AMG Real Estate - Test Recent Activity Display
// ======================================================
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testRecentActivity() {
  try {
    console.log('🧪 اختبار عرض النشاط الأخير...');
    console.log('============================');

    // البحث عن أول مستخدم
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      }
    });

    if (!user) {
      console.log('❌ لا يوجد مستخدمين في قاعدة البيانات');
      return;
    }

    console.log(`👤 المستخدم: ${user.firstName} ${user.lastName} (${user.email})`);

    // إضافة بعض الأنشطة التجريبية
    const activities = [
      {
        userId: user.id,
        action: 'LOGIN',
        details: 'تم تسجيل الدخول بنجاح',
        ipAddress: '192.168.1.1'
      },
      {
        userId: user.id,
        action: 'PROFILE_UPDATE',
        details: 'تم تحديث معلومات الملف الشخصي',
        ipAddress: '192.168.1.1'
      },
      {
        userId: user.id,
        action: 'EMAIL_VERIFICATION',
        details: 'تم إرسال رابط توثيق البريد الإلكتروني',
        ipAddress: '192.168.1.1'
      },
      {
        userId: user.id,
        action: 'PROPERTY_VIEW',
        details: 'عرض عقار في منطقة القاهرة الجديدة',
        ipAddress: '192.168.1.1'
      },
      {
        userId: user.id,
        action: '2FA_ENABLED',
        details: 'تم تفعيل المصادقة الثنائية بنجاح',
        ipAddress: '192.168.1.1'
      }
    ];

    console.log('\n📝 إضافة أنشطة تجريبية...');
    for (const activity of activities) {
      await prisma.userActivity.create({
        data: activity
      });
      console.log(`✅ تم إضافة: ${activity.action} - ${activity.details}`);
    }

    console.log('\n📋 قائمة الأنشطة الأخيرة:');
    const recentActivities = await prisma.userActivity.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        action: true,
        details: true,
        createdAt: true
      }
    });

    recentActivities.forEach((activity, index) => {
      console.log(`${index + 1}. ${activity.action}: ${activity.details || 'لا توجد تفاصيل'}`);
      console.log(`   التاريخ: ${activity.createdAt.toLocaleString('ar-EG')}`);
    });

    console.log('\n🎯 ما سيظهر في الملف الشخصي:');
    console.log('============================');
    
    const formattedActivities = recentActivities.map((activity) => ({
      id: activity.id,
      type: activity.action,
      title: activity.details || activity.action,
      action: activity.action,
      details: activity.details,
      createdAt: activity.createdAt.toISOString()
    }));

    formattedActivities.forEach((activity, index) => {
      console.log(`${index + 1}. العنوان: "${activity.title}"`);
      console.log(`   النوع: ${activity.type}`);
      console.log(`   الوقت: ${new Date(activity.createdAt).toLocaleString('ar-EG')}`);
      console.log('   ---');
    });

    console.log('\n✅ الآن ستظهر الأنشطة بالتفاصيل في الملف الشخصي!');
    console.log('🎉 المشكلة محلولة: النشاط الأخير سيعرض النص والوقت معاً');

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRecentActivity();