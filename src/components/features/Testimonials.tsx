'use client'

import { motion } from 'framer-motion'
import { StarIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import Image from 'next/image'

const testimonials = [
  {
    id: 1,
    name: "أحمد محمد علي",
    role: "رجل أعمال",
    content: "تعاملت مع AMG في شراء فيلا بالتجمع الخامس والخدمة كانت ممتازة من البداية للنهاية. فريق محترف ومتعاون.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    project: "فيلا التجمع الخامس"
  },
  {
    id: 2,
    name: "فاطمة حسن",
    role: "محاسبة",
    content: "بفضل AMG حققت حلمي في امتلاك شقة بموقع متميز بسعر مناسب. الفريق ساعدني في كل الإجراءات وكانوا صادقين جداً.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=120&h=120&q=80",
    project: "شقة بالقاهرة الجديدة"
  },
  {
    id: 3,
    name: "محمود أحمد",
    role: "مهندس",
    content: "استثمرت في محل تجاري من خلال AMG والعائد ممتاز. خدمة ما بعد البيع رائعة ولا زالوا يتابعون معي.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80",
    project: "محل تجاري بالعاصمة الإدارية"
  }
]

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const activeTestimonial = testimonials[currentTestimonial]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <StarIcon className="w-4 h-4" />
            آراء عملائنا
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ماذا يقول
            <span className="text-blue-600"> عملاؤنا</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            آراء حقيقية من عملاء راضين عن خدماتنا وجودة عملنا
          </p>
        </motion.div>

        {/* Main Testimonial */}
        <motion.div
          key={activeTestimonial.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
            {/* Rating Stars */}
            <div className="flex justify-center mb-6">
              {[...Array(activeTestimonial.rating)].map((_, i) => (
                <StarIcon key={i} className="w-6 h-6 text-yellow-400" />
              ))}
            </div>

            {/* Testimonial Content */}
            <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic">
              &ldquo;{activeTestimonial.content}&rdquo;
            </blockquote>

            {/* Client Info */}
            <div className="flex items-center justify-center gap-4">
              <Image
                src={activeTestimonial.image}
                alt={activeTestimonial.name}
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
              <div className="text-right">
                <div className="font-bold text-gray-900 text-lg">
                  {activeTestimonial.name}
                </div>
                <div className="text-gray-600">
                  {activeTestimonial.role}
                </div>
                <div className="text-blue-600 text-sm font-medium">
                  {activeTestimonial.project}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prevTestimonial}
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">5000+</div>
            <div className="text-gray-600">عميل سعيد</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">99%</div>
            <div className="text-gray-600">نسبة الرضا</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-yellow-600 mb-2">4.9/5</div>
            <div className="text-gray-600">التقييم</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">15+</div>
            <div className="text-gray-600">سنة خبرة</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
