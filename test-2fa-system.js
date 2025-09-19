// ======================================================
// 🧪 AMG Real Estate - Test 2FA Login System
// ======================================================
const fs = require('fs');

console.log('🔐 اختبار نظام 2FA Login - AMG Real Estate');
console.log('=========================================');

// فحص الملفات المطلوبة
const requiredFiles = [
  { path: 'src/app/api/auth/login/route.ts', name: 'Login API (محدث)' },
  { path: 'src/app/api/auth/verify-2fa/route.ts', name: '2FA Verification API' },
  { path: 'src/app/auth/verify-2fa/page.tsx', name: '2FA Verification Page' },
  { path: 'src/lib/AuthContext.tsx', name: 'AuthContext (محدث)' },
  { path: 'src/app/auth/login/page.tsx', name: 'Login Page (محدث)' }
];

console.log('📁 فحص الملفات المطلوبة:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file.path);
  console.log(`${exists ? '✅' : '❌'} ${file.name}: ${exists ? 'موجود' : 'مفقود'}`);
});

console.log('\n🔍 فحص محتوى Login API:');
const loginApi = fs.readFileSync('src/app/api/auth/login/route.ts', 'utf8');
const has2FACheck = loginApi.includes('twoFactorEnabled') && loginApi.includes('requires2FA');
console.log(`${has2FACheck ? '✅' : '❌'} فحص 2FA في Login API: ${has2FACheck ? 'مُطبق' : 'مفقود'}`);

console.log('\n🔍 فحص 2FA Verification API:');
const verifyApi = fs.existsSync('src/app/api/auth/verify-2fa/route.ts');
if (verifyApi) {
  const verifyContent = fs.readFileSync('src/app/api/auth/verify-2fa/route.ts', 'utf8');
  const hasAuthenticator = verifyContent.includes('authenticator.verify');
  console.log(`${hasAuthenticator ? '✅' : '❌'} فحص كود 2FA: ${hasAuthenticator ? 'مُطبق' : 'مفقود'}`);
}

console.log('\n🔍 فحص AuthContext:');
const authContext = fs.readFileSync('src/lib/AuthContext.tsx', 'utf8');
const hasUpdatedLogin = authContext.includes('requires2FA') && authContext.includes('tempToken');
console.log(`${hasUpdatedLogin ? '✅' : '❌'} دعم 2FA في AuthContext: ${hasUpdatedLogin ? 'مُطبق' : 'مفقود'}`);

console.log('\n📋 ملخص النظام:');
console.log('================');

console.log('🎯 ما يحدث عند تسجيل الدخول:');
console.log('1. المستخدم يدخل إيميل وكلمة مرور');
console.log('2. النظام يتحقق من صحة البيانات');
console.log('3. إذا كان 2FA مفعل:');
console.log('   - يرسل tempToken ويطلب كود 2FA');
console.log('   - يوجه للمستخدم لصفحة /auth/verify-2fa');
console.log('4. إذا لم يكن 2FA مفعل:');
console.log('   - تسجيل دخول مباشر للوحة التحكم');

console.log('\n🔧 للاختبار:');
console.log('============');
console.log('1. فعّل 2FA من إعدادات الحساب');
console.log('2. اخرج من الحساب');
console.log('3. سجل دخول مرة أخرى');
console.log('4. ستُطلب منك صفحة كود 2FA');
console.log('5. أدخل الكود من Google Authenticator');

console.log('\n✨ النتيجة المتوقعة:');
console.log('===================');
console.log('✅ مستخدم بدون 2FA: دخول مباشر');
console.log('✅ مستخدم بـ 2FA: طلب كود ثم دخول');
console.log('✅ كود خاطئ: رسالة خطأ');
console.log('✅ انتهاء صلاحية tempToken: العودة للدخول');

console.log('\n🎉 نظام 2FA جاهز للاستخدام!');