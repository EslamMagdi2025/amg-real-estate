// 🧪 اختبار رفع الصور على Cloudinary
require('dotenv').config({ path: '.env.local' })
const { v2: cloudinary } = require('cloudinary')
const fs = require('fs')
const path = require('path')

async function testCloudinary() {
  console.log('🌤️ اختبار إعدادات Cloudinary...')
  
  // التحقق من المتغيرات
  const requiredVars = ['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    console.log('❌ متغيرات مفقودة:', missing.join(', '))
    return
  }
  
  console.log('✅ جميع متغيرات Cloudinary موجودة')
  console.log('🔧 إعداد Cloudinary...')
  
  // إعداد Cloudinary
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
  
  try {
    // اختبار الاتصال
    console.log('📡 اختبار الاتصال مع Cloudinary...')
    const result = await cloudinary.api.ping()
    console.log('✅ اتصال Cloudinary نجح!', result)
    
    // إنشاء صورة تجريبية (1x1 pixel)
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    
    console.log('📤 رفع صورة تجريبية...')
    
    // رفع صورة تجريبية
    const uploadResult = await cloudinary.uploader.upload(testImageBase64, {
      public_id: `amg-test/test-${Date.now()}`,
      folder: 'amg-test',
      transformation: [
        { width: 400, height: 300, crop: 'limit', quality: 'auto:good' }
      ],
      tags: ['test', 'amg-website']
    })
    
    console.log('🎉 تم رفع الصورة بنجاح!')
    console.log('📸 URL:', uploadResult.secure_url)
    console.log('🆔 Public ID:', uploadResult.public_id)
    console.log('📏 المقاسات:', `${uploadResult.width}x${uploadResult.height}`)
    console.log('💾 الحجم:', uploadResult.bytes, 'bytes')
    
    // اختبار حذف الصورة التجريبية
    console.log('🗑️ حذف الصورة التجريبية...')
    await cloudinary.uploader.destroy(uploadResult.public_id)
    console.log('✅ تم حذف الصورة التجريبية بنجاح')
    
    // عرض إحصائيات الاستخدام
    console.log('\n📊 إحصائيات Cloudinary:')
    const usage = await cloudinary.api.usage()
    console.log(`📁 المساحة المستخدمة: ${(usage.storage.used_bytes / 1024 / 1024).toFixed(2)} MB`)
    console.log(`📈 عدد الصور: ${usage.storage.total_count}`)
    console.log(`🚀 Credits المستخدمة: ${usage.credits.used}`)
    
  } catch (error) {
    console.log('❌ خطأ في Cloudinary:')
    console.log(error.message)
    
    if (error.message.includes('Invalid API key')) {
      console.log('💡 مشكلة في API Key - تأكد من صحة الـ credentials')
    } else if (error.message.includes('cloud_name')) {
      console.log('💡 مشكلة في Cloud Name - تأكد من NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME')
    }
  }
}

// تشغيل الاختبار
testCloudinary().catch(console.error)