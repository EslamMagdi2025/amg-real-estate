#!/usr/bin/env node

// 🚀 سكريبت لإضافة Environment Variables لـ Vercel

const fs = require('fs')
const path = require('path')

console.log('🔧 إعداد متغيرات البيئة لـ Vercel...\n')

const envContent = fs.readFileSync('.env.production', 'utf8')
const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'))

console.log('📋 المتغيرات المطلوبة لـ Vercel:')
console.log('=====================================\n')

lines.forEach((line, index) => {
  if (line.includes('=')) {
    const [key, value] = line.split('=', 2)
    console.log(`${index + 1}. ${key.trim()} = ${value.trim()}`)
  }
})

console.log('\n📝 خطوات الإعداد على Vercel:')
console.log('1. اذهب إلى: https://vercel.com/dashboard')
console.log('2. اختر مشروع amg-real-estate')
console.log('3. Settings → Environment Variables')
console.log('4. أضف كل متغير من القائمة أعلاه')
console.log('5. اختر Environment: Production')
console.log('6. اضغط Save')
console.log('\n✅ بعد إضافة المتغيرات، الإيميل هيشتغل على الموقع المنشور!')

// إنشاء ملف تعليمات
const instructions = `
# 📧 تفعيل البريد الإلكتروني على Vercel

## الوضع الحالي:
✅ الكود جاهز ويشتغل محلياً
✅ إعدادات Hostinger SMTP صحيحة
❌ المتغيرات غير موجودة على Vercel

## الحل:
1. اذهب إلى Vercel Dashboard
2. اختر مشروع amg-real-estate
3. Settings → Environment Variables
4. أضف المتغيرات من .env.production
5. اختر Environment: Production

## المتغيرات المهمة للإيميل:
- SMTP_HOST=smtp.hostinger.com
- SMTP_PORT=465
- SMTP_USER=site@amg-invest.com
- SMTP_PASS=Amg.2025@
- FROM_EMAIL=site@amg-invest.com
- NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app

## بعد الإعداد:
- الإيميل هيشتغل 100%
- التحقق من الإيميل هيعمل
- نماذج التواصل هتوصل
- الإشعارات هتشتغل

🚀 الموقع هيبقى professional بالكامل!
`

fs.writeFileSync('VERCEL_EMAIL_SETUP.md', instructions)
console.log('\n📄 تم إنشاء ملف التعليمات: VERCEL_EMAIL_SETUP.md')