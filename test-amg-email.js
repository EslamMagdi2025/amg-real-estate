// ⚡ اختبار إيميل AMG الجديد

const nodemailer = require('nodemailer');

// إعدادات إيميل AMG المضبوط
const transporter = nodemailer.createTransporter({
  host: "mail.amg-invest.com", // أو الـ host الصحيح من مزود الاستضافة
  port: 587,
  secure: false, // true للـ 465, false للـ 587
  auth: {
    user: "site@amg-invest.com",
    pass: "كلمة_المرور_الصحيحة" // ضع كلمة المرور الحقيقية هنا
  }
});

// اختبار الإرسال
transporter.sendMail({
  from: '"شركة AMG للاستثمار العقاري" <site@amg-invest.com>',
  to: "islam.magdy@example.com", // ضع إيميلك هنا للاختبار
  subject: "🎯 اختبار إيميل AMG - نظام جديد",
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div style="background: white; padding: 30px; border-radius: 15px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2d3748; text-align: center;">🏢 AMG Real Estate</h1>
        <h2 style="color: #4a5568;">مرحباً! 👋</h2>
        <p style="color: #718096; font-size: 16px; line-height: 1.6;">
          إذا وصلك هذا الإيميل، فإن إعدادات الإيميل المخصص تعمل بشكل مثالي! 🎉
        </p>
        <div style="background: #f0fff4; border: 1px solid #48bb78; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="color: #22543d; margin: 0; font-weight: bold;">
            ✅ الإيميل يُرسل من: site@amg-invest.com
          </p>
        </div>
        <p style="color: #718096;">
          الآن كل إيميلات التوثيق والترحيب ستحمل اسم شركة AMG الرسمي!
        </p>
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #a0aec0; font-size: 14px;">
            شركة AMG للاستثمار العقاري - إيميل احترافي
          </p>
        </div>
      </div>
    </div>
  `,
  text: "إذا وصلك هذا الإيميل، فإن إعدادات الإيميل المخصص تعمل بشكل مثالي! الإيميل يُرسل من: site@amg-invest.com"
}, (error, info) => {
  if (error) {
    console.log('❌ خطأ في الإرسال:', error.message);
    console.log('🔍 تحقق من:');
    console.log('1. كلمة مرور الإيميل صحيحة');
    console.log('2. إعدادات SMTP من مزود الاستضافة');
    console.log('3. البورت والـ Host صحيحين');
  } else {
    console.log('🎉 تم إرسال الإيميل بنجاح!');
    console.log('📧 ID الرسالة:', info.messageId);
    console.log('✅ الإيميل المرسل من: site@amg-invest.com');
    console.log('🏢 اسم المرسل: شركة AMG للاستثمار العقاري');
  }
});