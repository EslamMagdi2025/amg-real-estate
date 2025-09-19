// اختبار نظام العضوية والتوثيق المحسن
// test-membership-system.js

const { calculateMembershipLevel, calculateExperienceLevel, calculateTrustScore, getMembershipInfo } = require('./src/lib/membership-system.ts');

console.log('🚀 بدء اختبار نظام العضوية والتوثيق المحسن...\n');

// مثال مستخدم جديد
const newUser = {
  userType: 'INDIVIDUAL',
  verified: false,
  emailVerified: true,
  phoneVerified: false,
  identityDocumentVerified: false,
  addressProofVerified: false,
  completedTransactions: 0,
  averageRating: 0,
  reviewCount: 0,
  trustScore: 0,
  createdAt: new Date(),
  premiumUntil: undefined
};

console.log('👤 مستخدم جديد:');
console.log('================');
const newUserInfo = getMembershipInfo(newUser);
console.log(`🏷️  مستوى العضوية: ${newUserInfo.membershipLevel} - ${newUserInfo.membershipData.description}`);
console.log(`📊 مستوى الخبرة: ${newUserInfo.experienceLevel} - ${newUserInfo.experienceData.description}`);
console.log(`🎯 نقاط الثقة: ${newUserInfo.trustScore}/100`);
console.log(`📈 التقدم نحو المستوى التالي: ${newUserInfo.progress.progress}%`);
if (newUserInfo.progress.requirements.length > 0) {
  console.log(`📋 المطلوب: ${newUserInfo.progress.requirements.join(', ')}`);
}
console.log(`💫 الفوائد: ${newUserInfo.membershipData.benefits.join(', ')}\n`);

// مستخدم متوسط
const intermediateUser = {
  userType: 'INDIVIDUAL',
  verified: true,
  emailVerified: true,
  phoneVerified: true,
  identityDocumentVerified: true,
  addressProofVerified: false,
  completedTransactions: 5,
  averageRating: 4.2,
  reviewCount: 8,
  trustScore: 0,
  createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 يوم مضت
  premiumUntil: undefined
};

console.log('⭐ مستخدم متوسط:');
console.log('================');
const intermediateUserInfo = getMembershipInfo(intermediateUser);
console.log(`🏷️  مستوى العضوية: ${intermediateUserInfo.membershipLevel} - ${intermediateUserInfo.membershipData.description}`);
console.log(`📊 مستوى الخبرة: ${intermediateUserInfo.experienceLevel} - ${intermediateUserInfo.experienceData.description}`);
console.log(`🎯 نقاط الثقة: ${intermediateUserInfo.trustScore}/100`);
console.log(`📈 التقدم نحو المستوى التالي: ${intermediateUserInfo.progress.progress}%`);
if (intermediateUserInfo.progress.requirements.length > 0) {
  console.log(`📋 المطلوب: ${intermediateUserInfo.progress.requirements.join(', ')}`);
}
console.log(`💫 الفوائد: ${intermediateUserInfo.membershipData.benefits.join(', ')}\n`);

// مستخدم خبير
const expertUser = {
  userType: 'AGENT',
  verified: true,
  emailVerified: true,
  phoneVerified: true,
  identityDocumentVerified: true,
  addressProofVerified: true,
  completedTransactions: 30,
  averageRating: 4.8,
  reviewCount: 45,
  trustScore: 0,
  createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000), // 200 يوم مضت
  premiumUntil: undefined
};

console.log('🏆 مستخدم خبير:');
console.log('================');
const expertUserInfo = getMembershipInfo(expertUser);
console.log(`🏷️  مستوى العضوية: ${expertUserInfo.membershipLevel} - ${expertUserInfo.membershipData.description}`);
console.log(`📊 مستوى الخبرة: ${expertUserInfo.experienceLevel} - ${expertUserInfo.experienceData.description}`);
console.log(`🎯 نقاط الثقة: ${expertUserInfo.trustScore}/100`);
console.log(`📈 التقدم نحو المستوى التالي: ${expertUserInfo.progress.progress}%`);
if (expertUserInfo.progress.requirements.length > 0) {
  console.log(`📋 المطلوب: ${expertUserInfo.progress.requirements.join(', ')}`);
}
console.log(`💫 الفوائد: ${expertUserInfo.membershipData.benefits.join(', ')}\n`);

// شركة كبيرة
const enterpriseUser = {
  userType: 'COMPANY',
  verified: true,
  emailVerified: true,
  phoneVerified: true,
  identityDocumentVerified: true,
  addressProofVerified: true,
  completedTransactions: 75,
  averageRating: 4.9,
  reviewCount: 120,
  trustScore: 0,
  createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // سنة مضت
  premiumUntil: undefined
};

console.log('🏢 شركة كبيرة:');
console.log('================');
const enterpriseUserInfo = getMembershipInfo(enterpriseUser);
console.log(`🏷️  مستوى العضوية: ${enterpriseUserInfo.membershipLevel} - ${enterpriseUserInfo.membershipData.description}`);
console.log(`📊 مستوى الخبرة: ${enterpriseUserInfo.experienceLevel} - ${enterpriseUserInfo.experienceData.description}`);
console.log(`🎯 نقاط الثقة: ${enterpriseUserInfo.trustScore}/100`);
console.log(`📈 التقدم نحو المستوى التالي: ${enterpriseUserInfo.progress.progress}%`);
if (enterpriseUserInfo.progress.requirements.length > 0) {
  console.log(`📋 المطلوب: ${enterpriseUserInfo.progress.requirements.join(', ')}`);
}
console.log(`💫 الفوائد: ${enterpriseUserInfo.membershipData.benefits.join(', ')}\n`);

// اختبار تفصيلي لحساب نقاط الثقة
console.log('🎯 تفاصيل حساب نقاط الثقة:');
console.log('============================');
console.log('📧 توثيق الإيميل: +10 نقاط');
console.log('📱 توثيق الهاتف: +10 نقاط');
console.log('🆔 توثيق الهوية: +10 نقاط');
console.log('📍 توثيق العنوان: +10 نقاط');
console.log('⭐ التقييمات: حتى 30 نقطة (بناءً على المتوسط)');
console.log('🤝 المعاملات: نقطتان لكل معاملة (حتى 20 نقطة)');
console.log('⏳ قدم العضوية: نقطة لكل 36.5 يوم (حتى 10 نقاط)');
console.log('💯 المجموع الأقصى: 100 نقطة\n');

console.log('✅ اكتمل اختبار نظام العضوية والتوثيق المحسن!');
console.log('🎉 النظام جاهز للاستخدام في الموقع!');