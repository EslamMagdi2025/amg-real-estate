# 📧 إعداد Gmail للبريد الإلكتروني

## خطوات تفعيل Gmail:

### 1. إنشاء App Password في Gmail:
1. اذهب إلى Google Account Settings
2. Security → 2-Step Verification (فعل المصادقة الثنائية)
3. App passwords → اختر "Mail" → "Other"
4. اكتب "AMG Real Estate" واحصل على كلمة مرور

### 2. تحديث .env.local:
```bash
# إعدادات Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here
FROM_EMAIL=your-email@gmail.com
```

### 3. في .env لـ Vercel:
- اذهب إلى Vercel Dashboard
- Project Settings → Environment Variables
- أضف نفس المتغيرات أعلاه

## ✅ المميزات:
- مجاني تماماً
- موثوق 100%
- سهل الإعداد
- يعمل فوراً

## ⚠️ الحدود:
- 500 إيميل يومياً
- يجب تفعيل 2FA في Gmail