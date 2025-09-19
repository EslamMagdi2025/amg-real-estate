// نظام إرسال إيميلات التوثيق
// lib/email-service.ts

import nodemailer from 'nodemailer';

interface EmailData {
  to: string;
  name: string;
  verifyToken: string;
}

// إعدادات الإيميل - استخدام نفس إعدادات Contact Form (Hostinger)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true', // true للبورت 465
    auth: {
      user: process.env.SMTP_USER || 'site@amg-invest.com', // البريد الإلكتروني للإرسال
      pass: process.env.SMTP_PASS  // كلمة مرور الإيميل
    },
    // إعدادات Hostinger الإضافية
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * إرسال إيميل توثيق الحساب
 */
export async function sendVerificationEmail(emailData: EmailData): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/verify-email?token=${emailData.verifyToken}`;
    
    const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>توثيق البريد الإلكتروني - AMG Real Estate</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
          direction: rtl;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }
        .content {
          padding: 40px 30px;
        }
        .welcome {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
        }
        .message {
          color: #666;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .verify-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-weight: bold;
          text-align: center;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .verify-button:hover {
          transform: translateY(-2px);
        }
        .manual-link {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 15px;
          margin-top: 20px;
          word-break: break-all;
          font-family: monospace;
          font-size: 14px;
          color: #4a5568;
        }
        .footer {
          background-color: #f8fafc;
          padding: 20px 30px;
          text-align: center;
          color: #666;
          font-size: 14px;
          border-top: 1px solid #e2e8f0;
        }
        .security-note {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 6px;
          padding: 15px;
          margin-top: 20px;
          color: #856404;
        }
        .logo {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🏢 AMG Real Estate</div>
          <h1>توثيق البريد الإلكتروني</h1>
        </div>
        
        <div class="content">
          <div class="welcome">مرحباً ${emailData.name}! 👋</div>
          
          <div class="message">
            شكراً لانضمامك إلى منصة AMG Real Estate! لإكمال عملية التسجيل وتفعيل حسابك، يرجى النقر على الزر أدناه لتوثيق بريدك الإلكتروني.
          </div>
          
          <div style="text-align: center;">
            <a href="${verifyUrl}" class="verify-button">
              ✅ توثيق البريد الإلكتروني
            </a>
          </div>
          
          <div class="message">
            بعد توثيق بريدك الإلكتروني، ستحصل على:
            <ul>
              <li>🎯 +10 نقاط ثقة في ملفك الشخصي</li>
              <li>🔒 حماية أفضل لحسابك</li>
              <li>📧 إشعارات مهمة حول عقاراتك</li>
              <li>⭐ التقدم نحو العضوية المميزة</li>
            </ul>
          </div>
          
          <div class="security-note">
            <strong>⚠️ ملاحظة أمنية:</strong><br>
            هذا الرابط صالح لمدة 24 ساعة فقط لضمان أمان حسابك.
          </div>
          
          <div class="message">
            إذا لم تتمكن من النقر على الزر، يمكنك نسخ الرابط التالي ولصقه في متصفحك:
          </div>
          
          <div class="manual-link">
            ${verifyUrl}
          </div>
        </div>
        
        <div class="footer">
          <p>
            هذا إيميل تلقائي، يرجى عدم الرد عليه.<br>
            إذا لم تقم بإنشاء حساب في AMG Real Estate، يمكنك تجاهل هذا الإيميل.
          </p>
          <p style="margin-top: 15px; color: #999;">
            © 2025 AMG Real Estate. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"شركة AMG للاستثمار العقاري" <site@amg-invest.com>`,
      to: emailData.to,
      subject: '🔐 توثيق البريد الإلكتروني - AMG Real Estate',
      html: htmlContent,
      text: `
      مرحباً ${emailData.name}!
      
      شكراً لانضمامك إلى منصة AMG Real Estate!
      
      لتوثيق بريدك الإلكتروني، يرجى زيارة الرابط التالي:
      ${verifyUrl}
      
      هذا الرابط صالح لمدة 24 ساعة.
      
      تحياتنا،
      فريق AMG Real Estate
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ تم إرسال إيميل التوثيق بنجاح:', result.messageId);
    return true;

  } catch (error) {
    console.error('❌ خطأ في إرسال إيميل التوثيق:', error);
    return false;
  }
}

/**
 * إرسال إيميل تأكيد نجاح التوثيق
 */
export async function sendWelcomeEmail(to: string, name: string): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>مرحباً بك في AMG Real Estate</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
          direction: rtl;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .content {
          padding: 40px 30px;
        }
        .success-icon {
          font-size: 48px;
          text-align: center;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">🏢 AMG Real Estate</div>
          <h1>مرحباً بك في منصتنا!</h1>
        </div>
        
        <div class="content">
          <div class="success-icon">🎉</div>
          
          <div style="font-size: 18px; color: #333; margin-bottom: 20px; text-align: center;">
            تهانينا ${name}!
          </div>
          
          <div style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            تم توثيق بريدك الإلكتروني بنجاح! حسابك الآن مفعل ويمكنك الاستفادة من جميع خدمات المنصة.
          </div>
          
          <div style="color: #666; line-height: 1.6;">
            <strong>ما تم إضافته لحسابك:</strong>
            <ul>
              <li>🎯 10 نقاط ثقة</li>
              <li>✅ علامة الحساب الموثق</li>
              <li>📧 إشعارات الإيميل مفعلة</li>
              <li>🚀 التقدم نحو العضوية المميزة</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/dashboard" 
               style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold;">
              🏠 استكشاف المنصة
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: `"شركة AMG للاستثمار العقاري" <site@amg-invest.com>`,
      to: to,
      subject: '🎉 مرحباً بك في AMG Real Estate - تم توثيق حسابك!',
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ تم إرسال إيميل الترحيب بنجاح:', result.messageId);
    return true;

  } catch (error) {
    console.error('❌ خطأ في إرسال إيميل الترحيب:', error);
    return false;
  }
}