'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline'

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              ابدأ رحلتك العقارية
              <span className="block text-blue-400">معنا اليوم</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              تواصل معنا الآن واحصل على استشارة مجانية من خبرائنا لتحقيق أهدافك العقارية
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="group bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <span className="flex items-center gap-2">
                  تواصل معنا الآن
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              
              <Link
                href="/projects"
                className="group bg-white/15 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-white/25"
              >
                استكشف مشاريعنا
              </Link>
            </div>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Phone */}
            <div className="flex items-center justify-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <PhoneIcon className="w-6 h-6 text-blue-300" />
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-200 mb-1">اتصل بنا</div>
                <div className="font-bold text-white">+20 100 123 4567</div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center">
                <EnvelopeIcon className="w-6 h-6 text-teal-300" />
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-200 mb-1">راسلنا</div>
                <div className="font-bold text-white">info@amg-realestate.com</div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center justify-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <MapPinIcon className="w-6 h-6 text-purple-300" />
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-200 mb-1">زورنا</div>
                <div className="font-bold text-white">القاهرة الجديدة</div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
          >
            <p className="text-blue-100 mb-4">
              🏆 <strong>AMG Real Estate</strong> - شريكك الموثوق في عالم العقارات
            </p>
            <p className="text-sm text-blue-200">
              خبرة 15+ سنة | 5000+ عميل راضي | 200+ مشروع منجز
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
