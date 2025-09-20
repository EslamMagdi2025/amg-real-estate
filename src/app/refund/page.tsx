'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CreditCardIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function RefundPage() {
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
            <CreditCardIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              سياسة الاسترداد والإلغاء
            </h1>
            <p className="text-lg text-gray-600">
              شروط وأحكام استرداد الأموال وإلغاء الخدمات
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-right" dir="rtl">
            <h2>سياسة الاسترداد</h2>
            <p>
              نحن في AMG العقارية نسعى لضمان رضا عملائنا الكامل. في حال عدم رضاكم 
              عن خدماتنا، نوفر سياسة استرداد عادلة وشفافة.
            </p>

            <h3>الحالات المؤهلة للاسترداد</h3>
            <ul>
              <li>عدم تقديم الخدمة المتفق عليها</li>
              <li>تأخير غير مبرر في تنفيذ الخدمة</li>
              <li>عدم مطابقة الخدمة للمواصفات المتفق عليها</li>
              <li>إلغاء الخدمة من قبل الشركة</li>
            </ul>

            <h3>مدة طلب الاسترداد</h3>
            <ul>
              <li>الخدمات الاستشارية: 7 أيام من تاريخ الخدمة</li>
              <li>خدمات التسويق: 14 يوم من بداية الحملة</li>
              <li>خدمات المعاينة: 3 أيام من تاريخ المعاينة</li>
              <li>الحجوزات: حسب شروط كل مشروع</li>
            </ul>

            <h3>إجراءات طلب الاسترداد</h3>
            <ol>
              <li>التواصل مع فريق خدمة العملاء</li>
              <li>تقديم تفاصيل الطلب والمبررات</li>
              <li>مراجعة الطلب من قبل الإدارة</li>
              <li>الرد خلال 3-5 أيام عمل</li>
              <li>تنفيذ الاسترداد خلال 7-10 أيام عمل</li>
            </ol>

            <h3>الاستثناءات</h3>
            <ul>
              <li>الخدمات المكتملة بالفعل</li>
              <li>الخدمات المخصصة وفقاً لطلب العميل</li>
              <li>العمولات على الصفقات المكتملة</li>
              <li>الرسوم الإدارية والقانونية</li>
            </ul>

            <h3>طرق الاسترداد</h3>
            <p>
              يتم الاسترداد بنفس طريقة الدفع الأصلية، أو عن طريق:
            </p>
            <ul>
              <li>التحويل البنكي</li>
              <li>شيك مصرفي</li>
              <li>خصم من فواتير مستقبلية</li>
            </ul>

            <h3>ضمان الجودة</h3>
            <p>
              نلتزم بتقديم خدمة عالية الجودة، وفي حال عدم الوصول للمعايير المطلوبة،
              نضمن إعادة تنفيذ الخدمة أو الاسترداد الكامل.
            </p>
          </div>

          {/* Contact Section */}
          <div className="mt-12 p-6 bg-orange-50 rounded-lg">
            <h3 className="text-xl font-semibold text-orange-900 mb-4">
              تحتاج للاستفسار عن الاسترداد؟
            </h3>
            <p className="text-orange-700 mb-4">
              تواصل مع فريق خدمة العملاء للحصول على المساعدة
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                تواصل معنا
              </Link>
              <a
                href="tel:+201000025080"
                className="inline-flex items-center justify-center px-6 py-3 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
              >
                اتصل الآن
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}