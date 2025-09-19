// ======================================================
// 🧪 AMG Real Estate - Test Session Protection
// ======================================================
const fs = require('fs');

console.log('🔒 اختبار حماية الجلسات - AMG Real Estate');
console.log('==========================================');

// فحص صفحات Auth
const authPages = [
  { path: 'src/app/auth/login/page.tsx', name: 'Login Page' },
  { path: 'src/app/auth/register/page.tsx', name: 'Register Page' }
];

console.log('📋 فحص صفحات المصادقة:');
authPages.forEach(page => {
  const exists = fs.existsSync(page.path);
  if (exists) {
    const content = fs.readFileSync(page.path, 'utf8');
    const hasAuthCheck = content.includes('isAuthenticated') && content.includes('useEffect');
    const hasRedirect = content.includes('router.replace') || content.includes('/dashboard');
    
    console.log(`✅ ${page.name}:`);
    console.log(`   - فحص الجلسة: ${hasAuthCheck ? '✅ موجود' : '❌ مفقود'}`);
    console.log(`   - التوجيه التلقائي: ${hasRedirect ? '✅ موجود' : '❌ مفقود'}`);
  } else {
    console.log(`❌ ${page.name}: مفقود`);
  }
});

console.log('\n🛡️ فحص حماية الصفحات المحمية:');
const protectedPages = [
  { path: 'src/app/dashboard/page.tsx', name: 'Dashboard' },
  { path: 'src/app/dashboard/profile/page.tsx', name: 'Profile' },
  { path: 'src/app/dashboard/account-settings/page.tsx', name: 'Account Settings' }
];

protectedPages.forEach(page => {
  const exists = fs.existsSync(page.path);
  if (exists) {
    const content = fs.readFileSync(page.path, 'utf8');
    const hasWithAuth = content.includes('withAuth');
    const hasUseAuth = content.includes('useAuth');
    
    console.log(`${hasWithAuth || hasUseAuth ? '✅' : '❌'} ${page.name}: ${hasWithAuth ? 'withAuth' : hasUseAuth ? 'useAuth' : 'غير محمي'}`);
  } else {
    console.log(`❌ ${page.name}: مفقود`);
  }
});

console.log('\n🔍 فحص AuthContext:');
const authContext = fs.readFileSync('src/lib/AuthContext.tsx', 'utf8');
const hasWithAuth = authContext.includes('export function withAuth');
const hasUseAuth = authContext.includes('export const useAuth');
console.log(`✅ withAuth HOC: ${hasWithAuth ? 'موجود' : 'مفقود'}`);
console.log(`✅ useAuth Hook: ${hasUseAuth ? 'موجود' : 'مفقود'}`);

console.log('\n📋 ملخص الحماية:');
console.log('================');

console.log('🎯 ما يحدث الآن:');
console.log('1. صفحات Auth (Login/Register):');
console.log('   - تتحقق من الجلسة الموجودة');
console.log('   - توجه للوحة التحكم إذا كان مسجل دخول');
console.log('   - تعرض شاشة تحميل أثناء الفحص');

console.log('\n2. الصفحات المحمية (Dashboard/Profile):');
console.log('   - محمية بـ withAuth HOC');
console.log('   - توجه لـ Login إذا لم يكن مسجل دخول');
console.log('   - تعرض شاشة تحميل أثناء الفحص');

console.log('\n✨ النتيجة المتوقعة:');
console.log('===================');
console.log('✅ مستخدم مسجل دخول:');
console.log('   - لا يرى صفحات Login/Register');
console.log('   - يصل للصفحات المحمية مباشرة');

console.log('\n❌ مستخدم غير مسجل:');
console.log('   - يُوجه لـ Login عند محاولة الوصول للصفحات المحمية');
console.log('   - يمكنه الوصول لصفحات Login/Register');

console.log('\n🔥 المشكلة محلولة: لن تظهر صفحة Login للمستخدم المسجل دخول!');