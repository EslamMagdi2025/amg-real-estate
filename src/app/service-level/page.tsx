'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShieldCheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function ServiceLevelPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link 
              href="/"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              العودة للرئيسية
            </Link>
          </div>

          <div className="text-center mb-12">
            <ShieldCheckIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              اتفاقية مستوى الخدمة
            </h1>
            <p className="text-lg text-gray-600">
              التزامنا بتقديم أفضل مستوى خدمة لعملائنا
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-right" dir="rtl">
            <h2>مستوى الخدمة المضمون</h2>
            <p>
              نحن في AMG العقارية نلتزم بتقديم أعلى مستويات الخدمة لعملائنا الكرام، 
              ونضمن الاستجابة السريعة والحلول المناسبة لجميع احتياجاتكم العقارية.
            </p>

            <h3>أوقات الاستجابة</h3>
            <ul>
              <li>الاستفسارات العامة: خلال 24 ساعة</li>
              <li>طلبات المعاينة: خلال 48 ساعة</li>
              <li>الاستفسارات العاجلة: خلال 4 ساعات</li>
              <li>الدعم الفني: خلال 2 ساعة</li>
            </ul>

            <h3>ضمانات الجودة</h3>
            <ul>
              <li>فريق متخصص ومدرب على أعلى مستوى</li>
              <li>متابعة مستمرة لجودة الخدمة</li>
              <li>تقييم دوري لرضا العملاء</li>
              <li>تحسين مستمر للعمليات والخدمات</li>
            </ul>

            <h3>قنوات التواصل</h3>
            <ul>
              <li>الهاتف: +20 1000025080</li>
              <li>البريد الإلكتروني: info@amg-invest.com</li>
              <li>الموقع الإلكتروني: نموذج التواصل</li>
              <li>واتساب: متاح 24/7</li>
            </ul>

            <h3>التزاماتنا</h3>
            <p>
              نتعهد بتقديم خدمة متميزة تلبي توقعاتكم وتفوقها، مع الحفاظ على 
              أعلى معايير الشفافية والمهنية في جميع تعاملاتنا.
            </p>
          </div>

          {/* Contact Section */}
          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              هل تحتاج إلى مساعدة؟
            </h3>
            <p className="text-blue-700 mb-4">
              فريق الدعم متاح لمساعدتك في أي وقت
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              تواصل معنا
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}