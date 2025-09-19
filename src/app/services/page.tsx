'use client'

import { motion } from 'framer-motion'
import OptimizedImage from '@/components/ui/OptimizedImage'
import { 
  WrenchScrewdriverIcon,
  PaintBrushIcon,
  CubeTransparentIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PhoneIcon,
  StarIcon,
  UserGroupIcon,
  ClockIcon,
  CogIcon,
  HomeIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import SEOHead from '@/components/SEOHead'

// خدمات الشركة الأساسية
const services = [
  {
    id: 0,
    title: 'بيع وشراء العقارات',
    description: 'خدمات متكاملة لبيع وشراء العقارات السكنية والتجارية مع ضمان أفضل الأسعار والمواقع المتميزة',
    icon: HomeIcon,
    features: [
      'استشارات عقارية متخصصة',
      'تقييم العقارات بدقة عالية',
      'إجراءات قانونية آمنة',
      'متابعة ما بعد البيع'
    ],
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    stats: '500+ عميل راضي',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 1,
    title: 'الإنشاءات والمقاولات',
    description: 'تنفيذ خرسانات ومباني وأعمال الإنشاءات بأعلى معايير الجودة والالتزام بالمواعيد',
    icon: WrenchScrewdriverIcon,
    features: [
      'تنفيذ خرسانات مسلحة',
      'أعمال المباني والحوائط',
      'الأساسات والهياكل الخرسانية',
      'مراقبة الجودة المستمرة'
    ],
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    buttonColor: 'bg-orange-600 hover:bg-orange-700',
    stats: '200+ مشروع',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'التشطيبات والديكورات',
    description: 'تشطيبات داخلية وخارجية عالية الجودة مع تصاميم عصرية ومواد فاخرة',
    icon: PaintBrushIcon,
    features: [
      'تشطيبات داخلية وخارجية',
      'تصاميم ديكور حديثة',
      'مواد تشطيب عالية الجودة',
      'إضاءة متخصصة ومتطورة'
    ],
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    stats: '150+ تصميم',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'الأثاث المنزلي',
    description: 'تصميم وتنفيذ أثاث منزلي مخصص بجودة عالية وتصاميم عصرية',
    icon: CubeTransparentIcon,
    features: [
      'غرف نوم مودرن وكلاسيك',
      'ركنيات وصالونات فاخرة',
      'مكاتب ووحدات تخزين',
      'دريسنج وخزائن مدمجة'
    ],
    color: 'from-teal-500 to-green-500',
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-600',
    buttonColor: 'bg-teal-600 hover:bg-teal-700',
    stats: '500+ قطعة',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    title: 'التسويق العقاري',
    description: 'تسويق وتطوير المشاريع العقارية المتميزة والمجمعات السكنية والتجارية',
    icon: BuildingOfficeIcon,
    features: [
      'تسويق الأبراج والمجمعات السكنية',
      'تطوير المشاريع التجارية',
      'تسويق الفلل والأراضي',
      'مراكز الأعمال والمشاريع الفندقية'
    ],
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    stats: '100+ حملة',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    title: 'تشطيب مصانع وإيبوكسي',
    description: 'تشطيبات صناعية متخصصة وأرضيات إيبوكسي عالية الجودة للمصانع والمنشآت الصناعية',
    icon: CogIcon,
    features: [
      'أرضيات إيبوكسي مقاومة للمواد الكيميائية',
      'تشطيبات صناعية متخصصة',
      'مقاومة للأحمال الثقيلة',
      'ضمان 10 سنوات'
    ],
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    buttonColor: 'bg-indigo-600 hover:bg-indigo-700',
    stats: '50+ مصنع',
    image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?auto=format&fit=crop&w=800&q=80'
  }
]

// إحصائيات الشركة
const companyStats = [
  { number: '15+', label: 'سنة خبرة', icon: ClockIcon },
  { number: '500+', label: 'عميل راضي', icon: UserGroupIcon },
  { number: '200+', label: 'مشروع منجز', icon: BuildingOfficeIcon },
  { number: '4.9', label: 'تقييم العملاء', icon: StarIcon }
]

export default function ServicesPage() {
  return (
    <>
      <SEOHead 
        title="خدماتنا - مجموعة أحمد الملاح"
        description="تعرف على خدماتنا المتخصصة في الإنشاءات والتشطيبات والأثاث والتسويق العقاري"
      />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section */}
        <section className="relative">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl mt-8 overflow-hidden">
              <div className="relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 h-full">
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=2000&q=80"
                    alt="خدماتنا المتخصصة"
                    fill
                    sizes="100vw"
                    className="object-cover w-full h-full"
                    quality={60}
                  />
                </div>
                
                {/* Content */}
                <div className="relative z-10 px-8 py-16 text-center text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 mb-6"
                    >
                      <StarIcon className="w-4 h-4 text-yellow-300" />
                      <span className="text-sm font-medium">خدمات متميزة منذ 2009</span>
                    </motion.div>
                    
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                      خدماتنا المتخصصة
                    </h1>
                    
                    <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8 leading-relaxed">
                      نقدم حلول عقارية متكاملة بخبرة تزيد عن 15 عاماً
                    </p>
                    
                    {/* Service Categories */}
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                        <span className="text-sm font-medium">إنشاءات</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                        <span className="text-sm font-medium">تشطيبات</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                        <span className="text-sm font-medium">أثاث</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                        <span className="text-sm font-medium">تسويق عقاري</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {companyStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="text-center group motion-safe"
                  style={{ transform: 'translateZ(0)' }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
              className="text-center mb-12 motion-safe"
              style={{ transform: 'translateZ(0)' }}
            >
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                <BuildingOfficeIcon className="w-4 h-4" />
                خدماتنا المتميزة
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                نبني أحلامكم بـ
                <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent"> الاحترافية</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                كل خدمة نقدمها هي التزام منا بالجودة والتميز والابتكار في عالم البناء والتطوير
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="group relative motion-safe"
                  style={{ transform: 'translateZ(0)' }}
                >
                  <div className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    
                    {/* Service Image */}
                    <div className="relative h-48 overflow-hidden">
                      <OptimizedImage
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        quality={75}
                        placeholder="blur"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      
                      {/* Service Icon */}
                      <div className="absolute top-4 left-4">
                        <div className={`w-10 h-10 bg-gradient-to-br ${service.color} rounded-lg flex items-center justify-center shadow-lg`}>
                          <service.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      
                      {/* Stats Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1">
                          <span className="text-xs font-bold text-gray-800">{service.stats}</span>
                        </div>
                      </div>
                      
                      {/* Overlay Content */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-lg font-bold text-white drop-shadow-lg">
                          {service.title}
                        </h3>
                      </div>
                    </div>

                    {/* Service Content */}
                    <div className="p-6">
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                        {service.description}
                      </p>

                      {/* Features Grid */}
                      <div className="grid grid-cols-1 gap-2 mb-6">
                        {service.features.slice(0, 3).map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center gap-2 p-1"
                          >
                            <div className={`w-5 h-5 ${service.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <CheckCircleIcon className={`w-3 h-3 ${service.iconColor}`} />
                            </div>
                            <span className="text-gray-700 text-xs">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <Link
                        href={
                          service.id === 0 ? "/services/real-estate" :
                          service.id === 1 ? "/services/construction" :
                          service.id === 2 ? "/services/finishing" :
                          service.id === 3 ? "/services/furniture" :
                          service.id === 4 ? "/services/marketing" :
                          service.id === 5 ? "/services/industrial" :
                          "/contact"
                        }
                        className={`block text-center ${service.buttonColor} text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm hover:scale-105`}
                      >
                        اطلب الخدمة الآن
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 md:px-8 lg:px-16 py-8">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl overflow-hidden">
            <div className="relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 h-full">
                <OptimizedImage
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80"
                  alt="تواصل معنا"
                  fill
                  sizes="100vw"
                  className="object-cover w-full h-full"
                  quality={60}
                />
              </div>
              
              <div className="relative z-10 px-8 py-12 text-center text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="motion-safe"
                  style={{ transform: 'translateZ(0)' }}
                >
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 mb-6">
                    <PhoneIcon className="w-4 h-4 text-green-200" />
                    <span className="text-sm font-medium">نحن في انتظار مكالمتك</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    مستعدون لتحويل أحلامكم لحقيقة؟
                  </h2>
                  
                  <p className="text-green-100 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
                    اتصلوا بنا اليوم واحصلوا على استشارة مجانية مع خبرائنا في العقارات والإنشاءات
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-8">
                    <Link
                      href="/contact"
                      className="w-full sm:w-auto bg-white text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
                    >
                      احجز استشارة مجانية
                    </Link>
                    
                    <a
                      href="tel:+201000025080"
                      className="w-full sm:w-auto bg-green-800 hover:bg-green-900 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
                    >
                      01000025080
                    </a>
                  </div>
                  
                  {/* Trust Indicators */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-2xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                      <div className="text-2xl font-bold text-white mb-1">24/7</div>
                      <div className="text-green-200 text-xs">خدمة العملاء</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                      <div className="text-2xl font-bold text-white mb-1">100%</div>
                      <div className="text-green-200 text-xs">ضمان الجودة</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                      <div className="text-2xl font-bold text-white mb-1">15+</div>
                      <div className="text-green-200 text-xs">سنة خبرة</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                      <div className="text-2xl font-bold text-white mb-1">4.9★</div>
                      <div className="text-green-200 text-xs">تقييم العملاء</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}