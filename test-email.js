// 🧪 اختبار إرسال البريد الإلكتروني
require('dotenv').config({ path: '.env.local' })
const nodemailer = require('nodemailer')

async function testEmail() {
  console.log('🧪 اختبار إعدادات البريد الإلكتروني...')
  
  // التحقق من المتغيرات
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS']
  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    console.log('❌ متغيرات مفقودة:', missing.join(', '))
    console.log('💡 تأكد من إضافة هذه المتغيرات في .env.local:')
    missing.forEach(varName => {
      console.log(`   ${varName}=your-value-here`)
    })
    return
  }
  
  console.log('✅ جميع المتغيرات موجودة')
  console.log('📡 محاولة الاتصال بخادم SMTP...')
  
  try {
    // إنشاء transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    })
    
    // اختبار الاتصال
    await transporter.verify()
    console.log('✅ اتصال SMTP نجح!')
    
    // إرسال إيميل تجريبي
    console.log('📧 إرسال إيميل تجريبي...')
    
    const emailHTML = `
        <div style="font-family: Arial; direction: rtl; text-align: right;">
          <h2>🎉 مبروك! البريد الإلكتروني يعمل</h2>
          <p>هذا إيميل تجريبي من موقع AMG العقاري</p>
          <p><strong>التاريخ:</strong> ${new Date().toLocaleString('ar-EG')}</p>
          <p><strong>الخادم:</strong> ${process.env.SMTP_HOST}</p>
          <hr />
          <p>إذا وصلك هذا الإيميل، فهذا يعني أن النظام يعمل بشكل صحيح! 🚀</p>
        </div>
      `
    
    const testEmailData = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // إرسال للنفس للاختبار
      subject: '🧪 اختبار - موقع AMG العقاري',
      html: emailHTML
    }
    
    const result = await transporter.sendMail(testEmailData)
    console.log('🎉 تم إرسال الإيميل بنجاح!')
    console.log('📨 ID:', result.messageId)
    console.log('✅ تحقق من صندوق الوارد في:', process.env.SMTP_USER)
    
  } catch (error) {
    console.log('❌ خطأ في إرسال البريد:')
    console.log(error.message)
    
    if (error.code === 'EAUTH') {
      console.log('💡 مشكلة في اسم المستخدم أو كلمة المرور')
      console.log('   - تأكد من صحة SMTP_USER و SMTP_PASS')
      console.log('   - إذا كنت تستخدم Gmail، تأكد من إنشاء App Password')
    } else if (error.code === 'ECONNECTION') {
      console.log('💡 مشكلة في الاتصال بالخادم')
      console.log('   - تأكد من صحة SMTP_HOST و SMTP_PORT')
      console.log('   - تحقق من الاتصال بالإنترنت')
    }
  }
}

// تشغيل الاختبار
testEmail().catch(console.error)