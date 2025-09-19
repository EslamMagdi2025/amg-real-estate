// ======================================================
// 🧪 اختبار إعدادات Hostinger - AMG Real Estate
// ======================================================
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testHostingerEmail() {
  try {
    console.log('🧪 اختبار إعدادات Hostinger...');
    console.log('================================');
    
    // عرض الإعدادات
    console.log('📋 الإعدادات:');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✅ موجود' : '❌ مفقود');
    console.log('================================');

    // إنشاء الـ transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // اختبار الاتصال
    console.log('🔌 اختبار الاتصال...');
    await transporter.verify();
    console.log('✅ الاتصال نجح!');

    // إرسال إيميل تجريبي
    console.log('📧 إرسال إيميل تجريبي...');
    const result = await transporter.sendMail({
      from: `"AMG Real Estate Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // إرسال للنفس للاختبار
      subject: '🧪 اختبار إعدادات Hostinger - AMG Real Estate',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #3b82f6; text-align: center;">🎉 نجح الاختبار!</h2>
            <p style="color: #333; line-height: 1.6;">
              تم إرسال هذا الإيميل بنجاح من خلال إعدادات Hostinger.
            </p>
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong style="color: #155724;">✅ إعدادات الإيميل تعمل بشكل صحيح!</strong>
            </div>
            <p style="color: #666; font-size: 14px;">
              AMG Real Estate - نظام التوثيق<br>
              التاريخ: ${new Date().toLocaleString('ar-SA')}
            </p>
          </div>
        </div>
      `,
      text: 'اختبار إعدادات Hostinger نجح! إعدادات الإيميل تعمل بشكل صحيح.'
    });

    console.log('✅ تم إرسال الإيميل بنجاح!');
    console.log('📨 Message ID:', result.messageId);
    console.log('================================');
    console.log('🎉 جميع الاختبارات نجحت!');
    console.log('✅ يمكنك الآن استخدام نظام التوثيق');
    
  } catch (error) {
    console.error('❌ فشل الاختبار:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('💡 الحل: تحقق من اسم المستخدم وكلمة المرور في Hostinger');
    } else if (error.message.includes('EAUTH')) {
      console.log('💡 الحل: تحقق من إعدادات الإيميل في لوحة تحكم Hostinger');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('💡 الحل: تحقق من الاتصال بالإنترنت أو SMTP_HOST');
    }
  }
}

testHostingerEmail();