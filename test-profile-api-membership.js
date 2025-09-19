// اختبار API البروفايل مع نظام العضوية الجديد
// test-profile-api-membership.js

const https = require('https');

async function testProfileAPI() {
  console.log('🚀 بدء اختبار API البروفايل مع نظام العضوية...\n');

  // محاولة جلب البروفايل
  try {
    const response = await fetch('http://localhost:3003/api/user/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // في حالة وجود token حقيقي، ضعه هنا
        'Cookie': 'auth-token=your-token-here'
      }
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ نجح جلب البروفايل!');
      console.log('=====================================');
      
      const profile = data.data;
      console.log(`👤 المستخدم: ${profile.fullName}`);
      console.log(`📧 الإيميل: ${profile.email}`);
      console.log(`📱 الهاتف: ${profile.phone || 'غير محدد'}`);
      console.log(`🆔 نوع المستخدم: ${profile.userType}`);
      console.log(`✅ موثق: ${profile.verified ? 'نعم' : 'لا'}`);
      
      if (profile.membership) {
        console.log('\n🏆 معلومات العضوية:');
        console.log('==================');
        console.log(`🏷️  المستوى: ${profile.membership.level}`);
        console.log(`📊 الوصف: ${profile.membership.levelData.description}`);
        console.log(`🎯 الأيقونة: ${profile.membership.levelData.icon}`);
        console.log(`🎨 اللون: ${profile.membership.levelData.color}`);
        
        console.log(`\n📈 مستوى الخبرة: ${profile.membership.experience}`);
        console.log(`📋 الوصف: ${profile.membership.experienceData.description}`);
        console.log(`🎯 الأيقونة: ${profile.membership.experienceData.icon}`);
        
        console.log(`\n🎯 نقاط الثقة: ${profile.membership.trustScore}/100`);
        
        if (profile.membership.progress.nextLevel) {
          console.log(`\n📈 التقدم نحو ${profile.membership.progress.nextLevel}:`);
          console.log(`⚡ التقدم: ${profile.membership.progress.progress}%`);
          if (profile.membership.progress.requirements.length > 0) {
            console.log(`📋 المطلوب:`);
            profile.membership.progress.requirements.forEach(req => {
              console.log(`   • ${req}`);
            });
          }
        }
        
        console.log(`\n💫 فوائد العضوية:`);
        profile.membership.levelData.benefits.forEach(benefit => {
          console.log(`   • ${benefit}`);
        });
      } else {
        console.log('\n⚠️  لم يتم العثور على معلومات العضوية (قد يكون المستخدم غير مسجل دخول)');
      }
      
      console.log('\n📊 الإحصائيات:');
      console.log('==============');
      if (profile.stats && profile.stats.properties) {
        console.log(`🏠 العقارات: ${profile.stats.properties.total}`);
        console.log(`✅ نشط: ${profile.stats.properties.active}`);
        console.log(`⏳ معلق: ${profile.stats.properties.pending}`);
        console.log(`💰 مباع: ${profile.stats.properties.sold}`);
        console.log(`🏠 مؤجر: ${profile.stats.properties.rented}`);
      }
      
      if (profile.stats && profile.stats.reviews) {
        console.log(`⭐ التقييمات: ${profile.stats.reviews.count}`);
        console.log(`📊 المتوسط: ${profile.stats.reviews.averageRating}/5`);
      }
      
    } else {
      console.log('❌ فشل في جلب البروفايل:', data.message);
      console.log('💡 قد يكون السبب: عدم تسجيل الدخول أو انتهاء الجلسة');
    }
    
  } catch (error) {
    console.log('❌ خطأ في الاتصال:', error.message);
    console.log('💡 تأكد من تشغيل الخادم على المنفذ 3003');
  }
  
  console.log('\n🎯 اختبار أنواع المستخدمين المختلفة:');
  console.log('=====================================');
  
  // محاكاة أنواع مختلفة من المستخدمين
  const userTypes = [
    {
      name: 'مستخدم جديد',
      data: { verified: false, emailVerified: true, transactions: 0, rating: 0, reviews: 0, days: 1 }
    },
    {
      name: 'مستخدم متوسط',
      data: { verified: true, emailVerified: true, transactions: 5, rating: 4.2, reviews: 8, days: 60 }
    },
    {
      name: 'مستخدم خبير',
      data: { verified: true, emailVerified: true, transactions: 30, rating: 4.8, reviews: 45, days: 200 }
    },
    {
      name: 'شركة كبيرة',
      data: { verified: true, emailVerified: true, transactions: 75, rating: 4.9, reviews: 120, days: 365 }
    }
  ];
  
  userTypes.forEach(user => {
    console.log(`\n${user.name}:`);
    console.log(`  ✅ موثق: ${user.data.verified ? 'نعم' : 'لا'}`);
    console.log(`  📧 إيميل موثق: ${user.data.emailVerified ? 'نعم' : 'لا'}`);
    console.log(`  🤝 المعاملات: ${user.data.transactions}`);
    console.log(`  ⭐ التقييم: ${user.data.rating}/5`);
    console.log(`  👥 عدد التقييمات: ${user.data.reviews}`);
    console.log(`  📅 الأيام منذ التسجيل: ${user.data.days}`);
  });
  
  console.log('\n✅ اكتمل اختبار API البروفايل!');
  console.log('🎉 النظام جاهز للاستخدام!');
}

// تشغيل الاختبار
testProfileAPI();