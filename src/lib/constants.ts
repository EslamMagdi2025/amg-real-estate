// Constants for the AMG Real Estate website - Ahmed El Malah Group

export const COMPANY_INFO = {
  name: 'Ahmed El Malah Group',
  nameAr: 'مجموعة أحمد الملاح',
  fullNameAr: 'شركة أحمد الملاح جروب (AMG) للمقاولات والتشطيبات العامة',
  shortName: 'AMG',
  tagline: 'استثمر في مستقبلك',
  description: 'شركة أحمد الملاح جروب (AMG) - رائدة في مجال المقاولات والتشطيبات والتسويق العقاري',
  
  // Contact Information
  phone: '+20 1000025080',
  whatsapp: '201000025080',
  email: 'info@amg-invest.com',
  address: '9 Abdl El Hady & Panama St. Office no.2, Port Said',
  
  // Locations
  locations: {
    portSaid: {
      address: '9 Abdl El Hady & Panama St. Office no.2',
      city: 'Port Said',
      cityAr: 'بورسعيد'
    },
    cairo: {
      address: 'قريب من مول 7K، التجمع الخامس، القاهرة الجديدة',
      city: 'New Cairo', 
      cityAr: 'القاهرة الجديدة - التجمع الخامس'
    }
  },
  
  // Company Details
  founded: 2009,
  experience: new Date().getFullYear() - 2009,
  website: 'https://amg-invest.com',
  
  // About Company
  aboutAr: 'تأسست شركة أحمد الملاح جروب (AMG) للمقاولات والتشطيبات العامة عام 2009م وبعون الله ثم من خلال المثابرة والتطوير والاهتمام بالجودة أصبحت من الشركات الرائدة في مجال المقاولات، وقد حققت الشركة الكثير من النجاحات في هذا المجال.',
  
  // Vision
  visionAr: 'أن تصبح شركة أحمد الملاح جروب (AMG) من أبرز المساهمين في النهضة الإنشائية في جمهورية مصر العربية وأن تحافظ على موقع الريادة في السوق. والاستمرار في تنفيذ المشاريع المبتكرة والتصاميم الراقية التي يكون لها أثر إيجابي على مجتمعنا.',
  
  // Mission
  missionAr: 'نسعى لتجاوز توقعات العملاء عبرَ تزويدهم بخدمات استثنائية مميّزة ومنتجات ذات جودة عالية وقيمة مضافة. وأن تبقى الشركة رائدة في جميع الأنشطة التي تقوم بها من خلال تنفيذ المشاريع وتسليمها بأعلى درجات الجودة والكفاءة من حيث التكلفة.',
  
  // Core Values
  values: [
    {
      title: 'الالتزام',
      description: 'نسعى لتحقيق الالتزام الكامل بكافة التعهدات والاتفاقيات التي نبرمها مع شركائنا وعملائنا'
    },
    {
      title: 'الكفاءة', 
      description: 'نعمل على تطوير قدراتنا بشكل مستمر لضمان كفاءة مواردنا البشرية على تقديم المنتج الأفضل'
    },
    {
      title: 'الإبداع',
      description: 'تتمحور حوله كل أعمالنا على حرص بيئتنا الداخلية والمحفزة للإبداع'
    },
    {
      title: 'الجودة',
      description: 'ترتكز استراتيجيتنا على ضمان مستوى عالٍ من الجودة في الأعمال التي ننجزها'
    }
  ],
  
  // Work Principles
  principles: [
    'تقديم المشورة الفنية للعميل',
    'العمل باحترافية عالية', 
    'الالتزام بمواعيد التسليم والمواصفات الفنية'
  ]
}

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/ahmedelmalahgroup/',
  whatsapp: 'https://wa.me/201000025080',
  email: 'mailto:info@amg-invest.com',
}

// Company Services
export const COMPANY_SERVICES = {
  main: [
    {
      id: 'construction',
      nameAr: 'الإنشاءات',
      description: 'تنفيذ خرسانات ومباني',
      icon: '🏗️'
    },
    {
      id: 'finishing', 
      nameAr: 'تشطيبات وديكورات',
      description: 'تشطيبات عالية الجودة',
      icon: '🎨'
    },
    {
      id: 'furniture',
      nameAr: 'أثاث منزلي',
      description: 'تصميم وتنفيذ الأثاث',
      icon: '🪑'
    },
    {
      id: 'marketing',
      nameAr: 'التسويق العقاري', 
      description: 'تسويق وتطوير المشاريع',
      icon: '📈'
    }
  ],
  
  furniture: [
    { nameAr: 'غرفة نوم', icon: '🛏️' },
    { nameAr: 'غرفة أولاد', icon: '🧸' },
    { nameAr: 'غرفة بنات', icon: '🎀' },
    { nameAr: 'ركنيات', icon: '🛋️' },
    { nameAr: 'صالونات', icon: '🪑' },
    { nameAr: 'مكاتب', icon: '🗃️' },
    { nameAr: 'دريسنج', icon: '👗' }
  ]
}

export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'شقة', icon: '🏠' },
  { value: 'villa', label: 'فيلا', icon: '🏘️' },
  { value: 'office', label: 'مكتب', icon: '🏢' },
  { value: 'commercial', label: 'تجاري', icon: '🏪' },
  { value: 'land', label: 'أرض', icon: '🏞️' },
]

export const PROPERTY_PURPOSES = [
  { value: 'sale', label: 'للبيع', color: 'blue' },
  { value: 'rent', label: 'للإيجار', color: 'green' },
]

export const PROPERTY_STATUS = [
  { value: 'active', label: 'متاح', color: 'green' },
  { value: 'pending', label: 'معلق', color: 'yellow' },
  { value: 'sold', label: 'تم البيع', color: 'red' },
  { value: 'rented', label: 'تم الإيجار', color: 'red' },
]

export const CAIRO_DISTRICTS = [
  'القاهرة الجديدة',
  'مدينة نصر',
  'المعادي',
  'مصر الجديدة',
  'الزمالك',
  'وسط البلد',
  'التجمع الأول',
  'التجمع الثالث',
  'التجمع الخامس',
  'الرحاب',
  'القاهرة الجديدة',
  'مدينتي',
  'الشروق',
  'بدر',
  'العبور',
]

export const GIZA_DISTRICTS = [
  'المهندسين',
  'الدقي',
  'العجوزة',
  'الزمالك',
  'الجيزة',
  'الهرم',
  'فيصل',
  'العمرانية',
  'أكتوبر',
  'الشيخ زايد',
  'البراجيل',
  'دريم لاند',
  'بيفرلي هيلز',
  'الكرمة',
]

export const CITIES = [
  { value: 'cairo', label: 'القاهرة', districts: CAIRO_DISTRICTS },
  { value: 'giza', label: 'الجيزة', districts: GIZA_DISTRICTS },
  { value: 'alexandria', label: 'الإسكندرية', districts: [] },
  { value: 'hurghada', label: 'الغردقة', districts: [] },
  { value: 'sharm', label: 'شرم الشيخ', districts: [] },
]

export const SERVICES = [
  {
    id: 'real-estate',
    title: 'بيع العقارات',
    description: 'خدمات شاملة لبيع وشراء العقارات',
    icon: '🏢',
    color: 'blue',
  },
  {
    id: 'marketing',
    title: 'التسويق العقاري',
    description: 'حملات تسويقية احترافية لعقاراتك',
    icon: '📈',
    color: 'green',
  },
  {
    id: 'construction',
    title: 'الإنشاءات',
    description: 'خدمات إنشائية متكاملة بأعلى الجودة',
    icon: '🏗️',
    color: 'orange',
  },
  {
    id: 'furniture',
    title: 'الأثاث العصري',
    description: 'تصميم وتوريد أثاث عصري ومودرن',
    icon: '🪑',
    color: 'purple',
  },
  {
    id: 'kitchens',
    title: 'المطابخ المودرن',
    description: 'تصميم وتنفيذ مطابخ عصرية',
    icon: '🏠',
    color: 'red',
  },
]

export const USER_TYPES = [
  { value: 'individual', label: 'فرد', description: 'مستخدم عادي' },
  { value: 'agent', label: 'وسيط عقاري', description: 'وسيط عقاري معتمد' },
  { value: 'company', label: 'شركة', description: 'شركة عقارية' },
  { value: 'admin', label: 'مدير', description: 'مدير النظام' },
]

export const PRICE_RANGES = [
  { min: 0, max: 500000, label: 'أقل من 500 ألف' },
  { min: 500000, max: 1000000, label: '500 ألف - مليون' },
  { min: 1000000, max: 2000000, label: 'مليون - 2 مليون' },
  { min: 2000000, max: 5000000, label: '2 - 5 مليون' },
  { min: 5000000, max: 10000000, label: '5 - 10 مليون' },
  { min: 10000000, max: Infinity, label: 'أكثر من 10 مليون' },
]

export const AREA_RANGES = [
  { min: 0, max: 100, label: 'أقل من 100 م²' },
  { min: 100, max: 150, label: '100 - 150 م²' },
  { min: 150, max: 200, label: '150 - 200 م²' },
  { min: 200, max: 300, label: '200 - 300 م²' },
  { min: 300, max: 500, label: '300 - 500 م²' },
  { min: 500, max: Infinity, label: 'أكثر من 500 م²' },
]

export const BEDROOM_OPTIONS = [
  { value: 1, label: 'غرفة واحدة' },
  { value: 2, label: 'غرفتان' },
  { value: 3, label: '3 غرف' },
  { value: 4, label: '4 غرف' },
  { value: 5, label: '5 غرف أو أكثر' },
]

export const AMENITIES = [
  'مصعد',
  'موقف سيارات',
  'حارس أمن',
  'حديقة',
  'مسبح',
  'جيم',
  'ملعب أطفال',
  'مول تجاري',
  'مسجد',
  'مدرسة قريبة',
  'مستشفى قريب',
  'مواصلات',
  'إنترنت',
  'تكييف مركزي',
  'تدفئة مركزية',
]

export const FEATURES = [
  'مفروش',
  'نصف مفروش',
  'غير مفروش',
  'مطبخ مجهز',
  'شرفة',
  'روف',
  'حديقة خاصة',
  'مدخل خاص',
  'مطل على البحر',
  'مطل على النيل',
  'مطل على حديقة',
  'دوبلكس',
  'ستوديو',
  'بنتهاوس',
]

export const CONTACT_METHODS = [
  { value: 'phone', label: 'هاتف', icon: '📞' },
  { value: 'whatsapp', label: 'واتساب', icon: '📱' },
  { value: 'email', label: 'بريد إلكتروني', icon: '📧' },
  { value: 'visit', label: 'زيارة', icon: '🏠' },
]

export const NAVIGATION_ITEMS = [
  { name: 'الرئيسية', href: '/', icon: '🏠' },
  { name: 'المشاريع', href: '/projects', icon: '🏗️' },
  { name: 'الخدمات', href: '/services', icon: '⚙️' },
  { name: 'الإعلانات', href: '/listings', icon: '📋' },
  { name: 'من نحن', href: '/about', icon: '👥' },
  { name: 'تواصل معنا', href: '/contact', icon: '📞' },
]

export const STATS = {
  happyClients: 500,
  completedProjects: 150,
  yearsExperience: COMPANY_INFO.experience,
  satisfactionRate: 98,
}

export const META_DEFAULTS = {
  title: 'AMG Real Estate - شركة AMG العقارية',
  description: 'شركة AMG العقارية - رائدة في مجال العقارات والإنشاءات والتصميم الداخلي',
  keywords: 'عقارات, القاهرة, مشاريع عقارية, إنشاءات, أثاث, مطابخ, AMG, تسويق عقاري',
  author: 'AMG Real Estate',
  siteUrl: 'https://amg-realestate.com',
  locale: 'ar_EG',
}
