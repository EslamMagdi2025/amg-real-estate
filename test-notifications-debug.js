// اختبار نظام الإشعارات
const fetch = require('node-fetch');

async function testNotifications() {
  try {
    console.log('🧪 اختبار نظام الإشعارات...\n');

    // اختبار 1: API الإشعارات بدون token
    console.log('📡 اختبار API الإشعارات بدون token:');
    const response1 = await fetch('http://localhost:3000/api/notifications');
    console.log('Status:', response1.status);
    const data1 = await response1.json();
    console.log('Response:', data1);
    console.log('---\n');

    // اختبار 2: Mock Store
    console.log('🗄️ اختبار Mock Store:');
    
    // في Node.js لا يمكننا استيراد الـ store مباشرة، لذلك سنختبر من خلال API
    // نحتاج token صحيح للاختبار
    
    console.log('✅ الاختبار مكتمل');
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error);
  }
}

testNotifications();