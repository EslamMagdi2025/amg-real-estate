'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { 
  HomeIcon,
  CheckIcon,
  ArrowRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  StarIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

export default function RealEstatePage() {
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
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', phone: '', email: '', message: '', serviceType: '' })
    }, 2000)
  }

  const propertyTypes = [
    {
      title: 'شقق سكنية',
      description: 'شقق بمواقع متميزة ومساحات متنوعة',
      price: 'من 800,000 جنيه',
      features: ['إطلالات رائعة', 'تشطيب فاخر', 'مواقع متميزة', 'أسعار منافسة'],
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'فيلات ومنازل',
      description: 'فيلات فاخرة بحدائق ومرافق متكاملة',
      price: 'من 3,000,000 جنيه',
      features: ['حدائق خاصة', 'مرافق متكاملة', 'أمان وحراسة', 'تصميمات عصرية'],
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'محلات تجارية',
      description: 'محلات بمواقع تجارية استراتيجية',
      price: 'من 1,500,000 جنيه',
      features: ['مواقع حيوية', 'عائد استثماري عالي', 'تراخيص جاهزة', 'مساحات مرنة'],
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    }
  ]

  const services = [
    {
      title: 'استشارات عقارية',
      description: 'نصائح من خبراء في السوق العقاري',
      icon: HomeIcon
    },
    {
      title: 'تقييم العقارات',
      description: 'تقييم دقيق للعقار بالأسعار الحالية',
      icon: CurrencyDollarIcon
    },
    {
      title: 'إجراءات قانونية',
      description: 'متابعة كاملة للأوراق والتوثيق',
      icon: CheckIcon
    },
    {
      title: 'معاينات مجانية',
      description: 'معاينة العقارات مع خبرائنا',
      icon: MapPinIcon
    }
  ]

  const testimonials = [
    {
      name: 'أحمد محمود',
      comment: 'ساعدوني في العثور على شقة أحلامي بسعر ممتاز',
      rating: 5,
      property: 'شقة بالتجمع الخامس'
    },
    {
      name: 'فاطمة علي',
      comment: 'خدمة احترافية ومتابعة مستمرة حتى إتمام الصفقة',
      rating: 5,
      property: 'فيلا بمدينة نصر'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <HomeIcon className="w-5 h-5" />
              <span className="font-medium">بيع وشراء العقارات</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              اعثر على عقارك المثالي
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              نساعدك في شراء أو بيع عقارك بأفضل الأسعار وأعلى معايير الخدمة
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#properties"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-colors"
              >
                اكتشف العقارات
              </Link>
              <Link
                href="#contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors"
              >
                تواصل معنا
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              خدماتنا المتخصصة
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نقدم مجموعة شاملة من الخدمات لضمان تجربة مثالية في رحلة البحث عن العقار
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section id="properties" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              أنواع العقارات المتاحة
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              اختر من مجموعة متنوعة من العقارات المميزة التي تناسب احتياجاتك وميزانيتك
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertyTypes.map((property, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {property.price}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-4">{property.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {property.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link
                    href="#contact"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block text-center"
                  >
                    اطلب معاينة
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ابدأ رحلتك العقارية معنا
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                تواصل معنا الآن وسيقوم فريقنا المتخصص بمساعدتك في العثور على العقار المثالي
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">الاسم</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">رقم الهاتف</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">نوع العقار المطلوب</label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">اختر نوع العقار</option>
                      <option value="apartment">شقة سكنية</option>
                      <option value="villa">فيلا</option>
                      <option value="commercial">محل تجاري</option>
                      <option value="land">أرض</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">تفاصيل إضافية</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أخبرنا عن متطلباتك والميزانية المتاحة..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'جاري الإرسال...' : 'اطلب استشارة مجانية'}
                  </button>
                  
                  {submitStatus === 'success' && (
                    <div className="text-green-600 text-center">
                      تم إرسال طلبك بنجاح! سنتواصل معك قريباً.
                    </div>
                  )}
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">معلومات التواصل</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">01000025080</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">info@amgrealestate.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ClockIcon className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">الأحد - الخميس: 9ص - 6م</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">لماذا تختارنا؟</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckIcon className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">خبرة 15+ سنة في السوق العقاري</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckIcon className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">500+ عميل راضي</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckIcon className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">أسعار تنافسية</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckIcon className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">متابعة مستمرة</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}