# ⚡ إعداد سريع لإيميل الدومين

## 🎯 ما تحتاجه:

1. **دومين مسجل** (مثل: amgrealestate.com)
2. **استضافة تدعم إيميل** (Hostinger, SiteGround, Namecheap, إلخ)
3. **5 دقائق من وقتك** ⏰

## 🚀 الخطوات السريعة:

### الخطوة 1: أنشئ إيميل في لوحة التحكم
```
إذهب لـ: Email Accounts في cPanel
أنشئ: info@yourdomain.com
كلمة المرور: قوية ومعقدة
```

### الخطوة 2: احصل على إعدادات SMTP
**الأكثر شيوعاً:**
```
Host: mail.yourdomain.com
Port: 587
Security: STARTTLS
Username: info@yourdomain.com
Password: كلمة المرور اللي حطيتها
```

### الخطوة 3: حدث .env.local
```env
# بدل yourdomain.com بالدومين بتاعك
SMTP_HOST="mail.yourdomain.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="info@yourdomain.com"
SMTP_PASS="كلمة_المرور_بتاعتك"
```

### الخطوة 4: اعمل restart للتطبيق
```bash
npm run dev
```

## ✅ اختبر التطبيق:
1. سجل حساب جديد
2. شوف لو الإيميل وصل
3. لو مش واصل، شوف الـ console للأخطاء

## 🆘 لو مش شغال:
**جرب إعدادات بديلة:**
```env
# جرب البورت دا
SMTP_PORT="465"
SMTP_SECURE="true"

# أو جرب دا  
SMTP_PORT="25"
SMTP_SECURE="false"
```

## 📞 محتاج مساعدة؟
- **تواصل مع مزود الاستضافة** واطلب إعدادات SMTP
- **قولهم**: "أريد إعدادات SMTP لإرسال إيميلات من الكود"
- **هم هيدوك** الإعدادات الصحيحة

**الهدف: إيميل احترافي بيحمل اسم شركتك!** 🏢📧