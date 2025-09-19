'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { 
  CubeTransparentIcon,
  CheckIcon,
  ArrowRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function FurniturePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    serviceType: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, serviceName: 'الأثاث المنزلي' })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', phone: '', email: '', message: '', serviceType: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const services = [
    {
      name: "غرف النوم",
      description: "أثاث غرف نوم كامل بتصميمات متنوعة",
      price: "من 15,000 جنيه"
    },
    {
      name: "غرف المعيشة",
      description: "أثاث صالونات وغرف معيشة أنيقة",
      price: "من 20,000 جنيه"
    },
    {
      name: "المطابخ العصرية",
      description: "تصميم وتنفيذ مطابخ بأحدث الأساليب والتقنيات",
      price: "من 25,000 جنيه"
    }
  ]

  const features = [
    "غرف نوم مودرن وكلاسيك",
    "ركنيات وصالونات فاخرة",
    "مكاتب ووحدات تخزين",
    "دريسنج وخزائن مدمجة",
    "تصميم مخصص حسب المساحة",
    "خامات عالية الجودة ومستوردة"
  ]

  const why_choose = [
    "خبرة تزيد عن 12 سنة في تصنيع الأثاث",
    "فريق من المصممين المحترفين",
    "خامات أوروبية عالية الجودة",
    "أسعار تنافسية ومناسبة للجميع",
    "ضمان 5 سنوات على جميع المنتجات",
    "خدمة توصيل وتركيب مجانية"
  ]

  const process = [
    {
      step: "1",
      title: "الاستشارة والقياس",
      description: "زيارة مجانية لأخذ المقاسات والاستشارة"
    },
    {
      step: "2",
      title: "التصميم والاختيار",
      description: "وضع التصميم واختيار الخامات والألوان"
    },
    {
      step: "3",
      title: "التصنيع",
      description: "بداية التصنيع في الورشة بأعلى جودة"
    },
    {
      step: "4",
      title: "التوصيل والتركيب",
      description: "توصيل وتركيب القطع في موقعها النهائي"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image 
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80" 
          alt="الأثاث المنزلي" 
          fill 
          className="object-cover" 
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6"
            >
              <CubeTransparentIcon className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              الأثاث المنزلي
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
            >
              تصميم وتنفيذ أثاث منزلي مخصص بجودة عالية وتصاميم عصرية
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Features Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckIcon className="w-6 h-6 text-blue-600 ml-3" />
                مميزات الخدمة
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}
                    className="flex items-center"
                  >
                    <CheckIcon className="w-5 h-5 text-blue-600 ml-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Services & Pricing */}
            <motion.section
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">الخدمات والأسعار</h2>
              <div className="space-y-6">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}
                    className="border-2 border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                      <span className="text-blue-600 font-bold text-lg">{service.price}</span>
                    </div>
                    <p className="text-gray-600">{service.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Why Choose Us */}
            <motion.section
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">لماذا تختارنا؟</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {why_choose.map((reason, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} 
                    transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}
                    className="flex items-center p-4 bg-blue-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full ml-3 flex-shrink-0" />
                    <span className="text-gray-700">{reason}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Process */}
            <motion.section
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8">خطوات العمل</h2>
              <div className="relative">
                {process.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.5, delay: index * 0.2 }} viewport={{ once: true }}
                    className="flex items-start mb-8 last:mb-0"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full font-bold text-lg ml-4 flex-shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar - Contact Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-6 sticky top-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">اطلب الخدمة الآن</h3>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">تم إرسال طلبك بنجاح! سنتواصل معك قريباً.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                  <input
                    type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                  <input
                    type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">نوع الخدمة المطلوبة</label>
                  <select
                    id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleInputChange} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر نوع الخدمة</option>
                    {services.map((service, index) => (
                      <option key={index} value={service.name}>{service.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">تفاصيل إضافية</label>
                  <textarea
                    id="message" name="message" value={formData.message} onChange={handleInputChange} rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="أخبرنا عن تفاصيل مشروعك..."
                  />
                </div>

                <button
                  type="submit" disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                      إرسال الطلب
                    </>
                  )}
                </button>
              </form>

              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">أو تواصل معنا مباشرة</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <PhoneIcon className="w-5 h-5 text-gray-400 ml-3" />
                    <span className="text-gray-600">01012345678</span>
                  </div>
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400 ml-3" />
                    <span className="text-gray-600">info@amgrealestate.com</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 text-gray-400 ml-3" />
                    <span className="text-gray-600">السبت - الخميس، 9:00 - 18:00</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}