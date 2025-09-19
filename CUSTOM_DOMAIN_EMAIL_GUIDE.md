# 🏢 دليل إعداد إيميل الدومين المخصص - AMG Real Estate

## 🎯 لماذا إيميل الدومين المخصص؟

### ✅ الفوائد:
- **مصداقية أعلى**: `info@amgrealestate.com` أفضل من `ahmed@gmail.com`
- **مظهر احترافي**: يبين إن الشركة حقيقية
- **ثقة المستخدمين**: الناس تثق أكثر في الإيميلات الرسمية
- **علامة تجارية**: كل إيميل يروّج للدومين بتاعك

### ❌ مشاكل Gmail/Outlook:
- يبدو غير احترافي
- ممكن يروح للـ Spam أكثر
- مش بيعكس هوية الشركة

## ⚙️ إعدادات إيميل الدومين

### الخطوة 1: الحصول على إعدادات SMTP

**إذا كان دومينك على Hostinger:**
```
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="587"
SMTP_SECURE="false" 
SMTP_USER="info@yourdomain.com"
SMTP_PASS="your-email-password"
```

**إذا كان دومينك على cPanel:**
```
SMTP_HOST="mail.yourdomain.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="info@yourdomain.com" 
SMTP_PASS="your-email-password"
```

**إذا كان دومينك على SiteGround:**
```
SMTP_HOST="smtp.siteground.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="info@yourdomain.com"
SMTP_PASS="your-email-password"
```

### الخطوة 2: إنشاء حساب إيميل

1. **ادخل على لوحة تحكم الاستضافة**
2. **اذهب إلى Email Accounts**
3. **أنشئ إيميل جديد**:
   - الاسم: `info` أو `noreply` أو `support`
   - الدومين: `@yourdomain.com`
   - كلمة المرور: قوية ومعقدة

### الخطوة 3: تحديث .env.local

```env
# إعدادات إيميل الدومين الخاص
SMTP_HOST="mail.amgrealestate.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="info@amgrealestate.com"
SMTP_PASS="YourStrongPassword123!"
NEXT_PUBLIC_APP_URL="https://amgrealestate.com"
```

## 🔧 أمثلة إعدادات شائعة

### Hostinger:
```env
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="587"
SMTP_USER="info@yourdomain.com"
SMTP_PASS="password"
```

### Namecheap:
```env
SMTP_HOST="mail.privateemail.com"
SMTP_PORT="587"  
SMTP_USER="info@yourdomain.com"
SMTP_PASS="password"
```

### GoDaddy:
```env
SMTP_HOST="smtpout.secureserver.net"
SMTP_PORT="80"
SMTP_USER="info@yourdomain.com"
SMTP_PASS="password"
```

### CloudFlare Email:
```env
SMTP_HOST="smtp.mailchannels.net"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
```

## 🎨 تخصيص اسم المرسل

في ملف `email-service.ts`:

```typescript
const mailOptions = {
  from: `"شركة AMG للاستثمار العقاري" <info@amgrealestate.com>`,
  to: emailData.to,
  subject: '🔐 توثيق البريد الإلكتروني - AMG Real Estate',
  // ...
};
```

**النتيجة للمستخدم:**
```
من: شركة AMG للاستثمار العقاري <info@amgrealestate.com>
إلى: أحمد محمد <user@gmail.com>
الموضوع: 🔐 توثيق البريد الإلكتروني - AMG Real Estate
```

## 🔍 اختبار الإعدادات

### الاختبار السريع:

```javascript
// test-domain-email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "mail.yourdomain.com",
  port: 587,
  secure: false,
  auth: {
    user: "info@yourdomain.com",
    pass: "your-password"
  }
});

transporter.sendMail({
  from: '"AMG Real Estate" <info@yourdomain.com>',
  to: "your-test-email@gmail.com",
  subject: "اختبار إيميل الدومين",
  text: "إذا وصلك هذا الإيميل، فالإعدادات صحيحة!"
}, (error, info) => {
  if (error) {
    console.log('❌ خطأ:', error);
  } else {
    console.log('✅ تم الإرسال:', info.messageId);
  }
});
```

## 🚨 حل المشاكل الشائعة

### المشكلة: "Authentication failed"
**الحل:**
- تحقق من اسم المستخدم وكلمة المرور
- تأكد إن الإيميل مُنشأ في لوحة التحكم

### المشكلة: "Connection timeout"
**الحل:**
- جرب البورت 465 بدلاً من 587
- جرب `SMTP_SECURE="true"`
- تحقق من إعدادات Firewall

### المشكلة: الإيميل يروح للـ Spam
**الحل:**
- أضف SPF Record في DNS
- أضف DKIM في لوحة التحكم
- استخدم اسم مرسل واضح

## 📊 إعدادات DNS (اختيارية ولكن مهمة)

### SPF Record:
```
v=spf1 include:_spf.hostinger.com ~all
```

### DKIM Record:
يتم إنشاؤه من لوحة تحكم الاستضافة

### DMARC Record:
```
v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com
```

## 🎉 النتيجة النهائية

بعد الإعداد الصحيح:
- ✅ الإيميلات تُرسل من `info@yourdomain.com`
- ✅ مظهر احترافي ومصداقية عالية  
- ✅ أقل احتمالية للذهاب إلى Spam
- ✅ تعزيز العلامة التجارية
- ✅ ثقة أكبر من المستخدمين

**إيميل الدومين المخصص = مصداقية أعلى + مظهر احترافي!** 🏢✨