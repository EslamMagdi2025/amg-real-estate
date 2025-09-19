'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  HomeIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
  CubeIcon
} from '@heroicons/react/24/outline'

const services = [
  {
    id: 1,
    title: "بيع وشراء العقارات",
    description: "خدمات متكاملة لبيع وشراء العقارات السكنية والتجارية",
    icon: HomeIcon,
    color: "blue",
    features: ["استشارات عقارية", "تقييم العقارات", "إجراءات قانونية"]
  },
  {
    id: 2,
    title: "التسويق العقاري",
    description: "حملات تسويقية احترافية لعقارك لضمان أفضل سعر",
    icon: BuildingOfficeIcon,
    color: "green",
    features: ["تصوير احترافي", "إعلانات رقمية", "عروض تقديمية"]
  },
  {
    id: 3,
    title: "أعمال الإنشاءات",
    description: "تنفيذ مشاريع الإنشاءات من التصميم إلى التسليم",
    icon: WrenchScrewdriverIcon,
    color: "orange",
    features: ["تصميم معماري", "إدارة مشاريع", "إشراف هندسي"]
  },
  {
    id: 4,
    title: "التشطيبات",
    description: "خدمات التشطيبات الداخلية والخارجية بأعلى جودة",
    icon: PaintBrushIcon,
    color: "purple",
    features: ["تشطيبات حديثة", "مواد عالية الجودة", "تسليم في الوقت"]
  },
  {
    id: 5,
    title: "الأثاث والمطابخ",
    description: "تصميم وتنفيذ الأثاث والمطابخ العصرية",
    icon: CubeIcon,
    color: "teal",
    features: ["تصاميم عصرية", "خامات فاخرة", "ضمان شامل"]
  }
]

export default function Services() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            خدماتنا المتميزة
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            حلول عقارية 
            <span className="text-blue-600"> شاملة</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نقدم مجموعة متكاملة من الخدمات العقارية لتلبية جميع احتياجاتك من الاستشارة إلى التنفيذ
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Service Icon */}
              <div className={`w-16 h-16 bg-${service.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className={`w-8 h-8 text-${service.color}-600`} />
              </div>

              {/* Service Info */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Learn More Link */}
              <Link
                href={
                  service.id === 1 ? "/services/real-estate" :
                  service.id === 2 ? "/services/marketing" :
                  service.id === 3 ? "/services/construction" :
                  service.id === 4 ? "/services/finishing" :
                  service.id === 5 ? "/services/furniture" :
                  "/services"
                }
                className={`inline-flex items-center text-${service.color}-600 hover:text-${service.color}-700 font-medium transition-colors`}
              >
                اعرف المزيد
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-4">
            هل تحتاج استشارة مجانية؟
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            تواصل معنا الآن للحصول على استشارة مجانية من خبرائنا واكتشف كيف يمكننا مساعدتك
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            احصل على استشارة مجانية
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
