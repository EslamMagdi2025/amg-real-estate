// ======================================================
// 🧪 AMG Real Estate - Test Email API
// ======================================================
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, text } = await request.json()

    console.log('🧪 Testing email with Gmail settings...')
    console.log('📧 Sending to:', to)

    // إعدادات Hostinger من المتغيرات البيئية (نفس Contact Form)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true', // true for port 465
      auth: {
        user: process.env.SMTP_USER || 'site@amg-invest.com',
        pass: process.env.SMTP_PASS
      },
      // إعدادات Hostinger الإضافية
      tls: {
        rejectUnauthorized: false
      }
    })

    // التحقق من الاتصال
    await transporter.verify()
    console.log('✅ SMTP connection verified')

    // إرسال الإيميل
    const result = await transporter.sendMail({
      from: `"AMG Real Estate Test" <${process.env.SMTP_USER || 'site@amg-invest.com'}>`,
      to: to,
      subject: subject,
      text: text,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f8f9fa;">
          <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #007bff;">🧪 اختبار إعدادات الإيميل</h2>
            <p style="color: #333; line-height: 1.6;">${text}</p>
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong style="color: #155724;">✅ إعدادات Gmail تعمل بشكل صحيح!</strong>
            </div>
            <p style="color: #666; font-size: 14px;">
              AMG Real Estate - نظام التوثيق
            </p>
          </div>
        </div>
      `
    })

    console.log('✅ Email sent successfully:', result.messageId)

    return NextResponse.json({
      success: true,
      message: 'تم إرسال الإيميل بنجاح!',
      messageId: result.messageId
    })

  } catch (error: any) {
    console.error('❌ Email test failed:', error)
    
    let errorMessage = 'فشل في إرسال الإيميل'
    
    if (error?.message?.includes('Invalid login')) {
      errorMessage = 'خطأ في اسم المستخدم أو كلمة المرور. تأكد من إعدادات Hostinger'
    } else if (error?.message?.includes('getaddrinfo ENOTFOUND')) {
      errorMessage = 'خطأ في اتصال الإنترنت أو SMTP_HOST'
    } else if (error?.message?.includes('EAUTH')) {
      errorMessage = 'خطأ في المصادقة. تحقق من بيانات Hostinger'
    }

    return NextResponse.json({
      success: false,
      message: errorMessage,
      error: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}