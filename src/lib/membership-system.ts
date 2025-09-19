// نظام العضوية والتوثيق المحسن
// lib/membership-system.ts

export type MembershipLevel = 'BASIC' | 'PREMIUM' | 'VIP' | 'ENTERPRISE';
export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type UserType = 'INDIVIDUAL' | 'AGENT' | 'COMPANY' | 'ADMIN';

export interface UserMembershipData {
  userType: UserType;
  verified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  identityDocumentVerified: boolean;
  addressProofVerified: boolean;
  completedTransactions: number;
  averageRating: number;
  reviewCount: number;
  trustScore: number;
  createdAt: Date;
  premiumUntil?: Date;
}

export interface MembershipCriteria {
  minTransactions: number;
  minTrustScore: number;
  minRating: number;
  verifiedRequired?: boolean;
  userTypes?: UserType[];
  description: string;
  icon: string;
  color: string;
  benefits: string[];
}

export interface ExperienceCriteria {
  maxTransactions?: number;
  minTransactions?: number;
  maxDays?: number;
  minDays?: number;
  minRating?: number;
  minTrustScore?: number;
  description: string;
  icon: string;
  color: string;
}

// معايير مستويات العضوية
export const MEMBERSHIP_CRITERIA: Record<MembershipLevel, MembershipCriteria> = {
  BASIC: {
    minTransactions: 0,
    minTrustScore: 0,
    minRating: 0,
    description: 'العضوية الأساسية',
    icon: '👤',
    color: 'gray',
    benefits: [
      'تصفح العقارات',
      'إضافة إعلان واحد',
      'الدعم الأساسي'
    ]
  },
  
  PREMIUM: {
    minTransactions: 3,
    minTrustScore: 40,
    minRating: 3.5,
    verifiedRequired: true,
    description: 'عضو مميز',
    icon: '⭐',
    color: 'blue',
    benefits: [
      'إضافة إعلانات متعددة',
      'إحصائيات متقدمة',
      'دعم مميز',
      'إشعارات فورية'
    ]
  },
  
  VIP: {
    minTransactions: 15,
    minTrustScore: 70,
    minRating: 4.2,
    verifiedRequired: true,
    description: 'عضو VIP',
    icon: '💎',
    color: 'purple',
    benefits: [
      'إعلانات مميزة',
      'أولوية في النتائج',
      'مدير حساب مخصص',
      'تقارير تحليلية'
    ]
  },
  
  ENTERPRISE: {
    minTransactions: 50,
    minTrustScore: 85,
    minRating: 4.5,
    verifiedRequired: true,
    userTypes: ['COMPANY', 'AGENT'],
    description: 'عضوية المؤسسات',
    icon: '🏢',
    color: 'gold',
    benefits: [
      'عدد غير محدود من الإعلانات',
      'صفحة شركة مخصصة',
      'API متقدم',
      'دعم 24/7'
    ]
  }
};

// معايير مستويات الخبرة
export const EXPERIENCE_CRITERIA: Record<ExperienceLevel, ExperienceCriteria> = {
  BEGINNER: {
    maxTransactions: 2,
    maxDays: 30,
    description: 'عضو جديد',
    icon: '🌱',
    color: 'green'
  },
  
  INTERMEDIATE: {
    minTransactions: 3,
    minDays: 30,
    maxTransactions: 10,
    description: 'متوسط الخبرة',
    icon: '📈',
    color: 'blue'
  },
  
  ADVANCED: {
    minTransactions: 10,
    minDays: 90,
    minRating: 4.0,
    description: 'متقدم',
    icon: '🎯',
    color: 'purple'
  },
  
  EXPERT: {
    minTransactions: 25,
    minDays: 180,
    minRating: 4.5,
    minTrustScore: 70,
    description: 'خبير',
    icon: '🏆',
    color: 'gold'
  }
};

/**
 * حساب مستوى العضوية بناءً على بيانات المستخدم
 */
export function calculateMembershipLevel(userData: UserMembershipData): MembershipLevel {
  const daysSinceRegistration = Math.floor(
    (Date.now() - userData.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  // فحص العضوية المميزة المدفوعة
  if (userData.premiumUntil && userData.premiumUntil > new Date()) {
    return 'PREMIUM';
  }

  // فحص معايير كل مستوى من الأعلى للأسفل
  for (const level of ['ENTERPRISE', 'VIP', 'PREMIUM'] as MembershipLevel[]) {
    const criteria = MEMBERSHIP_CRITERIA[level];
    
    // فحص نوع المستخدم إذا كان مطلوب
    if (criteria.userTypes && !criteria.userTypes.includes(userData.userType)) {
      continue;
    }
    
    // فحص التوثيق إذا كان مطلوب
    if (criteria.verifiedRequired && !userData.verified) {
      continue;
    }
    
    // فحص المعايير الأخرى
    if (userData.completedTransactions >= criteria.minTransactions &&
        userData.trustScore >= criteria.minTrustScore &&
        userData.averageRating >= criteria.minRating) {
      return level;
    }
  }
  
  return 'BASIC';
}

/**
 * حساب مستوى الخبرة بناءً على بيانات المستخدم
 */
export function calculateExperienceLevel(userData: UserMembershipData): ExperienceLevel {
  const daysSinceRegistration = Math.floor(
    (Date.now() - userData.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  // فحص معايير كل مستوى من الأعلى للأسفل
  for (const level of ['EXPERT', 'ADVANCED', 'INTERMEDIATE'] as ExperienceLevel[]) {
    const criteria = EXPERIENCE_CRITERIA[level];
    
    let meetsAllCriteria = true;
    
    // فحص الحد الأدنى للمعاملات
    if (criteria.minTransactions && userData.completedTransactions < criteria.minTransactions) {
      meetsAllCriteria = false;
    }
    
    // فحص الحد الأدنى للأيام
    if (criteria.minDays && daysSinceRegistration < criteria.minDays) {
      meetsAllCriteria = false;
    }
    
    // فحص الحد الأدنى للتقييم
    if (criteria.minRating && userData.averageRating < criteria.minRating) {
      meetsAllCriteria = false;
    }
    
    // فحص الحد الأدنى لنقاط الثقة
    if (criteria.minTrustScore && userData.trustScore < criteria.minTrustScore) {
      meetsAllCriteria = false;
    }
    
    if (meetsAllCriteria) {
      return level;
    }
  }
  
  return 'BEGINNER';
}

/**
 * حساب نقاط الثقة بناءً على عوامل متعددة
 */
export function calculateTrustScore(userData: UserMembershipData): number {
  let score = 0;
  
  // نقاط التوثيق (40 نقطة كحد أقصى)
  if (userData.emailVerified) score += 10;
  if (userData.phoneVerified) score += 10;
  if (userData.identityDocumentVerified) score += 10;
  if (userData.addressProofVerified) score += 10;
  
  // نقاط التقييم (30 نقطة كحد أقصى)
  if (userData.reviewCount > 0) {
    const ratingScore = (userData.averageRating / 5) * 30;
    score += ratingScore;
  }
  
  // نقاط المعاملات (20 نقطة كحد أقصى)
  const transactionScore = Math.min(userData.completedTransactions * 2, 20);
  score += transactionScore;
  
  // نقاط قدم العضوية (10 نقاط كحد أقصى)
  const daysSinceRegistration = Math.floor(
    (Date.now() - userData.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  const ageScore = Math.min(daysSinceRegistration / 36.5, 10); // نقطة واحدة كل 36.5 يوم (10 نقاط = سنة)
  score += ageScore;
  
  return Math.round(Math.min(score, 100));
}

/**
 * حساب التقدم نحو المستوى التالي
 */
export function calculateProgressToNextLevel(
  currentLevel: MembershipLevel,
  userData: UserMembershipData
): { nextLevel: MembershipLevel | null; progress: number; requirements: string[] } {
  const levels: MembershipLevel[] = ['BASIC', 'PREMIUM', 'VIP', 'ENTERPRISE'];
  const currentIndex = levels.indexOf(currentLevel);
  
  if (currentIndex === levels.length - 1) {
    return { nextLevel: null, progress: 100, requirements: [] };
  }
  
  const nextLevel = levels[currentIndex + 1];
  const nextCriteria = MEMBERSHIP_CRITERIA[nextLevel];
  const requirements: string[] = [];
  let totalRequirements = 0;
  let metRequirements = 0;
  
  // فحص التوثيق
  if (nextCriteria.verifiedRequired) {
    totalRequirements++;
    if (userData.verified) {
      metRequirements++;
    } else {
      requirements.push('توثيق الحساب مطلوب');
    }
  }
  
  // فحص المعاملات
  totalRequirements++;
  if (userData.completedTransactions >= nextCriteria.minTransactions) {
    metRequirements++;
  } else {
    const needed = nextCriteria.minTransactions - userData.completedTransactions;
    requirements.push(`${needed} معاملة إضافية`);
  }
  
  // فحص نقاط الثقة
  totalRequirements++;
  if (userData.trustScore >= nextCriteria.minTrustScore) {
    metRequirements++;
  } else {
    const needed = nextCriteria.minTrustScore - userData.trustScore;
    requirements.push(`${needed} نقطة ثقة إضافية`);
  }
  
  // فحص التقييم
  totalRequirements++;
  if (userData.averageRating >= nextCriteria.minRating) {
    metRequirements++;
  } else {
    const needed = nextCriteria.minRating.toFixed(1);
    requirements.push(`تقييم ${needed} أو أعلى`);
  }
  
  const progress = (metRequirements / totalRequirements) * 100;
  
  return { nextLevel, progress: Math.round(progress), requirements };
}

/**
 * الحصول على معلومات العضوية الكاملة
 */
export function getMembershipInfo(userData: UserMembershipData) {
  const membershipLevel = calculateMembershipLevel(userData);
  const experienceLevel = calculateExperienceLevel(userData);
  const trustScore = calculateTrustScore(userData);
  const progress = calculateProgressToNextLevel(membershipLevel, userData);
  
  return {
    membershipLevel,
    experienceLevel,
    trustScore,
    progress,
    membershipData: MEMBERSHIP_CRITERIA[membershipLevel],
    experienceData: EXPERIENCE_CRITERIA[experienceLevel]
  };
}