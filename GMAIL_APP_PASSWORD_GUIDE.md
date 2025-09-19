# 📧 إنشاء Gmail App Password - دليل سريع

## 🚀 خطوات سريعة لإنشاء Gmail App Password:

### الخطوة 1: تفعيل 2-Step Verification
1. اذهب إلى: https://myaccount.google.com/security
2. في قسم "Signing in to Google"
3. اضغط على "2-Step Verification"
4. اتبع الخطوات لتفعيلها (إذا لم تكن مفعلة)

### الخطوة 2: إنشاء App Password
1. ارجع لـ: https://myaccount.google.com/security
2. اضغط على "App passwords"
3. اختر "Mail" من القائمة
4. اختر "Other (custom name)" 
5. اكتب: "AMG Real Estate Website"
6. اضغط "Generate"

### الخطوة 3: نسخ كلمة المرور
1. ستظهر كلمة مرور من 16 رقم/حرف
2. انسخها فوراً (لن تظهر مرة أخرى)
3. مثال: `abcd efgh ijkl mnop`

### الخطوة 4: تحديث .env.local
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="eslammagdi2018@gmail.com"
SMTP_PASS="abcdefghijklmnop"
```

⚠️ **ملاحظة مهمة**: استخدم كلمة المرور بدون مسافات!

## 🔗 روابط مفيدة:
- **Gmail Security**: https://myaccount.google.com/security
- **App Passwords**: https://myaccount.google.com/apppasswords

## 🧪 اختبار سريع:
بعد التحديث:
1. احفظ ملف .env.local
2. أعد تشغيل السيرفر
3. جرب إرسال إيميل توثيق
4. تحقق من Gmail (Inbox أو Spam)

## 🎯 التوقع:
✅ إرسال إيميل ناجح
✅ وصول الإيميل خلال ثواني
✅ رابط التوثيق يعمل