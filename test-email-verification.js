// اختبار نظام توثيق الإيميل
// test-email-verification.js

console.log('🚀 بدء اختبار نظام توثيق الإيميل...\n');

// محاكاة إنشاء حساب جديد
async function testUserRegistration() {
  console.log('📝 1. اختبار التسجيل وإرسال إيميل التوثيق:');
  console.log('================================================');
  
  const registrationData = {
    firstName: 'أحمد',
    lastName: 'محمد',
    email: 'ahmed@example.com',
    phone: '01234567890',
    password: 'SecurePassword123',
    userType: 'INDIVIDUAL'
  };
  
  try {
    const response = await fetch('http://localhost:3003/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ تم إنشاء الحساب بنجاح!');
      console.log(`👤 المستخدم: ${result.user.firstName} ${result.user.lastName}`);
      console.log(`📧 الإيميل: ${result.user.email}`);
      console.log(`🔒 توثيق الإيميل: ${result.user.emailVerified ? 'موثق' : 'غير موثق'}`);
      console.log(`📨 إرسال إيميل التوثيق: ${result.emailSent ? 'نجح' : 'فشل'}`);
      console.log(`💬 الرسالة: ${result.message}\n`);
      
      return result.user;
    } else {
      console.log('❌ فشل في إنشاء الحساب:', result.message);
      return null;
    }
  } catch (error) {
    console.log('❌ خطأ في الاتصال:', error.message);
    return null;
  }
}

// محاكاة إعادة إرسال إيميل التوثيق
async function testResendVerification(email) {
  console.log('📧 2. اختبار إعادة إرسال إيميل التوثيق:');
  console.log('=============================================');
  
  try {
    const response = await fetch(`http://localhost:3003/api/auth/verify-email?email=${encodeURIComponent(email)}`, {
      method: 'GET'
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ تم إعادة إرسال إيميل التوثيق بنجاح!');
      console.log(`💬 الرسالة: ${result.message}\n`);
    } else {
      console.log('❌ فشل في إعادة الإرسال:', result.message);
    }
  } catch (error) {
    console.log('❌ خطأ في الاتصال:', error.message);
  }
}

// دالة لمحاكاة توثيق الإيميل (بدون رمز حقيقي)
async function simulateEmailVerification() {
  console.log('✅ 3. محاكاة توثيق الإيميل:');
  console.log('=============================');
  console.log('📧 في الحالة الطبيعية، المستخدم سيضغط على الرابط في الإيميل');
  console.log('🔗 الرابط سيكون بهذا الشكل: http://localhost:3003/verify-email?token=abc123...');
  console.log('✅ عند الضغط، سيتم توثيق الإيميل وإرسال إيميل ترحيب');
  console.log('🎯 المستخدم سيحصل على +10 نقاط ثقة\n');
}

// عرض تفاصيل نظام توثيق الإيميل
function showEmailSystemDetails() {
  console.log('📋 4. تفاصيل نظام توثيق الإيميل:');
  console.log('=================================');
  console.log('🔧 المكونات المطلوبة:');
  console.log('   • إعدادات SMTP في ملف .env');
  console.log('   • حساب إيميل للإرسال (Gmail/Outlook)');
  console.log('   • تفعيل "App Passwords" للأمان');
  console.log('');
  console.log('📤 أنواع الإيميلات:');
  console.log('   • إيميل التوثيق: يُرسل عند التسجيل');
  console.log('   • إيميل الترحيب: يُرسل بعد التوثيق');
  console.log('   • إعادة الإرسال: من صفحة إعدادات الحساب');
  console.log('');
  console.log('🎯 الفوائد:');
  console.log('   • +10 نقاط ثقة عند التوثيق');
  console.log('   • حماية أفضل للحساب');
  console.log('   • إشعارات مهمة عبر الإيميل');
  console.log('   • التقدم نحو العضوية المميزة');
  console.log('');
  console.log('⚙️ الإعدادات المطلوبة في .env:');
  console.log('   SMTP_HOST="smtp.gmail.com"');
  console.log('   SMTP_USER="your-email@gmail.com"');
  console.log('   SMTP_PASS="your-app-password"');
  console.log('   NEXT_PUBLIC_APP_URL="http://localhost:3003"');
  console.log('');
}

// تشغيل الاختبارات
async function runEmailVerificationTests() {
  try {
    // اختبار التسجيل
    const user = await testUserRegistration();
    
    if (user) {
      // اختبار إعادة الإرسال
      await testResendVerification(user.email);
    }
    
    // محاكاة التوثيق
    simulateEmailVerification();
    
    // عرض التفاصيل
    showEmailSystemDetails();
    
    console.log('🎉 اكتمل اختبار نظام توثيق الإيميل!');
    console.log('');
    console.log('📝 الخطوات التالية:');
    console.log('1. إعداد حساب Gmail أو Outlook للإرسال');
    console.log('2. إضافة إعدادات SMTP في ملف .env');
    console.log('3. تجربة التسجيل الحقيقي');
    console.log('4. فحص الإيميل والضغط على رابط التوثيق');
    console.log('5. التحقق من تحديث نقاط الثقة في البروفايل');
    
  } catch (error) {
    console.error('❌ خطأ في تشغيل الاختبارات:', error);
  }
}

// تشغيل الاختبار
runEmailVerificationTests();