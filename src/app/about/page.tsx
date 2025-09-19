'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  ClockIcon,
  CheckCircleIcon,
  LightBulbIcon,
  AcademicCapIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { COMPANY_INFO } from '@/lib/constants'
import SEOHead from '@/components/SEOHead'
import { ChromeOptimizedMotion, chromeAnimations } from '@/components/ui/ChromeOptimizedMotion'

const stats = [
  { number: `${COMPANY_INFO.experience}+`, label: 'سنة خبرة' },
  { number: '500+', label: 'مشروع منجز' },
  { number: '1000+', label: 'عميل راضي' },
  { number: '50+', label: 'مهندس وعامل' }
]

const valueIcons = {
  'الالتزام': CheckCircleIcon,
  'الكفاءة': AcademicCapIcon,
  'الإبداع': LightBulbIcon,
  'الجودة': StarIcon
}

export default function AboutPage() {
  return (
    <>
      <SEOHead 
        title="من نحن - مجموعة أحمد الملاح"
        description="تعرف على مجموعة أحمد الملاح (AMG) - رائدة في مجال المقاولات والتشطيبات والتسويق العقاري منذ 2009"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-20">
          <div className="relative pt-12 pb-20 mb-16 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-emerald-600">
            {/* Background Image */}
            <div className="absolute inset-0 bg-[url('/images/about-hero.jpg')] bg-cover bg-center bg-no-repeat opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-emerald-900/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-emerald-600/10" />
            <div className="relative px-4">
              <ChromeOptimizedMotion
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-center mb-16"
              >
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                  {COMPANY_INFO.nameAr}
                </h1>
                <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 drop-shadow">
                  {COMPANY_INFO.fullNameAr}
                </p>
                <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold border border-white/30">
                  <ClockIcon className="w-5 h-5 ml-2" />
                  تأسست عام {COMPANY_INFO.founded}
                </div>
              </ChromeOptimizedMotion>

              {/* Stats Grid */}
              <ChromeOptimizedMotion
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </ChromeOptimizedMotion>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <ChromeOptimizedMotion
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-6">قصتنا</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  {COMPANY_INFO.aboutAr}
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-3">رؤيتنا</h3>
                    <p className="text-blue-800 leading-relaxed">
                      {COMPANY_INFO.visionAr}
                    </p>
                  </div>
                  
                  <div className="bg-emerald-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-emerald-900 mb-3">مهمتنا</h3>
                    <p className="text-emerald-800 leading-relaxed">
                      {COMPANY_INFO.missionAr}
                    </p>
                  </div>
                </div>
              </ChromeOptimizedMotion>

              <ChromeOptimizedMotion
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-blue-100 to-emerald-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                  <BuildingOfficeIcon className="w-32 h-32 text-blue-600" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                  <UserGroupIcon className="w-8 h-8 text-emerald-600" />
                </div>
              </ChromeOptimizedMotion>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">قيمنا الأساسية</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                القيم التي نؤمن بها وتوجه كل أعمالنا نحو التميز والنجاح
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {COMPANY_INFO.values.map((value, index) => {
                const IconComponent = valueIcons[value.title as keyof typeof valueIcons]
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Principles Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">مبادئ عملنا</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                المبادئ التي نلتزم بها في كافة مشاريعنا وخدماتنا
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {COMPANY_INFO.principles.map((principle, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center bg-blue-50 rounded-lg p-6 mb-4 hover:bg-blue-100 transition-colors"
                >
                  <CheckCircleIcon className="w-6 h-6 text-blue-600 ml-4 flex-shrink-0" />
                  <span className="text-lg text-gray-800">{principle}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                {COMPANY_INFO.tagline}
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                انضم إلى عائلة عملائنا الراضين واكتشف الفرق في الجودة والخدمة
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  تواصل معنا الآن
                </a>
                <Link
                  href="/projects"
                  className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  اطلع على مشاريعنا
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}
