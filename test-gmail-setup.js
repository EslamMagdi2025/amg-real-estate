// 🧪 اختبار سريع لإعدادات Gmail

console.log('🧪 اختبار إعدادات Gmail - AMG Real Estate');
console.log('==========================================');

// ملاحظة: قم بتشغيل هذا الاختبار بعد إنشاء Gmail App Password

const testGmailConnection = async () => {
  console.log('📧 محاولة اختبار اتصال Gmail...');
  
  try {
    const response = await fetch('http://localhost:3000/api/test-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'eslammagdi2018@gmail.com',
        subject: '🧪 اختبار إعدادات Gmail - AMG Real Estate',
        text: 'إذا وصلك هذا الإيميل، فإن الإعدادات صحيحة!'
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ تم إرسال الإيميل بنجاح!');
      console.log('📧 تحقق من بريدك الإلكتروني');
    } else {
      console.log('❌ فشل في الإرسال:', result.message);
    }
  } catch (error) {
    console.log('❌ خطأ في الاتصال:', error.message);
  }
};

console.log('📋 تحقق من الإعدادات التالية في .env.local:');
console.log('============================================');
console.log('✅ SMTP_HOST="smtp.gmail.com"');
console.log('✅ SMTP_PORT="587"');
console.log('✅ SMTP_SECURE="false"');
console.log('✅ SMTP_USER="eslammagdi2018@gmail.com"');
console.log('✅ SMTP_PASS="your-16-digit-app-password"');
console.log('✅ NEXT_PUBLIC_APP_URL="http://localhost:3000"');

console.log('\n🔑 خطوات إنشاء Gmail App Password:');
console.log('====================================');
console.log('1. اذهب إلى: https://myaccount.google.com/security');
console.log('2. فعل "2-Step Verification" (إذا لم تكن مفعلة)');
console.log('3. اضغط على "App passwords"');
console.log('4. اختر "Mail" ثم "Other"');
console.log('5. اكتب "AMG Real Estate Website"');
console.log('6. انسخ كلمة المرور (16 حرف/رقم)');
console.log('7. ضعها في SMTP_PASS (بدون مسافات)');

console.log('\n⚡ بعد التحديث:');
console.log('================');
console.log('1. احفظ ملف .env.local');
console.log('2. أعد تشغيل السيرفر (npm run dev)');
console.log('3. جرب إرسال إيميل توثيق');
console.log('4. تحقق من Gmail خلال ثواني');

console.log('\n🎯 هذا سيحل مشكلة عدم وصول الإيميل فوراً!');

// لو عاوز تختبر الاتصال من المتصفح:
// testGmailConnection();