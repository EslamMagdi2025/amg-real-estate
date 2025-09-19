"use client";

import { motion } from 'framer-motion';
import ContactForm from '@/components/features/ContactForm'
import FreeMap from '@/components/ui/FreeMap';
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { COMPANY_INFO, SOCIAL_LINKS } from '@/lib/constants';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 pt-20">
        {/* Hero Section */}
        <div className="relative pt-12 pb-20 mb-16 rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600 to-blue-600">
          {/* Background Image */}
          <div className="absolute inset-0 bg-[url('/images/contact-hero.jpg')] bg-cover bg-center bg-no-repeat opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 to-blue-900/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-emerald-600/10" />
          <div className="relative px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                تواصل معنا
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow">
                نحن هنا لخدمتك والإجابة على جميع استفساراتك. تواصل معنا الآن وسنرد عليك في أقرب وقت ممكن
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">أرسل رسالة</h2>
                <ContactForm 
                  onSuccess={() => {
                    // Optionally scroll to success message or show notification
                  }}
                />
              </div>
            </motion.div>
            
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">معلومات الاتصال</h2>
                <p className="text-lg text-gray-600 mb-8">
                  يسعدنا تواصلك معنا بأي من الطرق التالية
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                <div className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center ml-4">
                    <PhoneIcon className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">اتصل بنا</h3>
                    <p className="text-gray-600">{COMPANY_INFO.phone}</p>
                  </div>
                </div>

                <div className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center ml-4">
                    <EnvelopeIcon className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">راسلنا</h3>
                    <p className="text-gray-600">{COMPANY_INFO.email}</p>
                  </div>
                </div>

                <div className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center ml-4">
                    <MapPinIcon className="w-7 h-7 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">زورنا - بورسعيد</h3>
                    <p className="text-gray-600">{COMPANY_INFO.locations.portSaid.address}</p>
                  </div>
                </div>

                <div className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center ml-4">
                    <MapPinIcon className="w-7 h-7 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">زورنا - القاهرة</h3>
                    <p className="text-gray-600">{COMPANY_INFO.locations.cairo.address}</p>
                  </div>
                </div>

                <div className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center ml-4">
                    <ClockIcon className="w-7 h-7 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">أوقات العمل</h3>
                    <p className="text-gray-600">السبت - الخميس: 9:00 ص - 8:00 م</p>
                    <p className="text-gray-600">الجمعة: 2:00 م - 8:00 م</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">تابعنا على</h3>
                <div className="flex space-x-4">
                  {Object.entries(SOCIAL_LINKS).map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                      title={key === 'facebook' ? 'Facebook' : key === 'whatsapp' ? 'WhatsApp' : 'Email'}
                    >
                      {key === 'facebook' && <span className="text-lg">📘</span>}
                      {key === 'whatsapp' && <span className="text-lg">📱</span>}
                      {key === 'email' && <span className="text-lg">📧</span>}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">موقعنا على الخريطة</h2>
            <p className="text-xl text-gray-600">يمكنك العثور علينا هنا - بورسعيد، مصر</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="h-96"
          >
            <FreeMap 
              lat={31.2568} 
              lng={32.2910} 
              address="بورسعيد، مصر" 
              className="h-full w-full"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              هل تريد بدء مشروعك الآن؟
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              لا تتردد في الاتصال بنا اليوم وسنساعدك في تحويل أحلامك إلى واقع
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <PhoneIcon className="w-5 h-5 ml-2" />
                اتصل بنا الآن
              </a>
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                💬 واتساب
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
