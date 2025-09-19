'use client'

import Link from 'next/link'
import Image from 'next/image'
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon
} from '@heroicons/react/24/outline'
import { COMPANY_INFO, SOCIAL_LINKS } from '@/lib/constants'

const footerNavigation = {
  main: [
    { name: 'الرئيسية', href: '/' },
    { name: 'المشاريع', href: '/projects' },
    { name: 'الخدمات', href: '/services' },
    { name: 'الإعلانات', href: '/listings' },
    { name: 'من نحن', href: '/about' },
    { name: 'تواصل معنا', href: '/contact' },
  ],
  services: [
    { name: 'بيع العقارات', href: '/services#real-estate' },
    { name: 'التسويق العقاري', href: '/services#marketing' },
    { name: 'الإنشاءات', href: '/services#construction' },
    { name: 'الأثاث العصري', href: '/services#furniture' },
    { name: 'المطابخ المودرن', href: '/services#kitchens' },
  ],
  legal: [
    { name: 'سياسة الخصوصية', href: '/privacy' },
    { name: 'شروط الاستخدام', href: '/terms' },
    { name: 'سياسة الاسترداد', href: '/refund' },
    { name: 'اتفاقية مستوى الخدمة', href: '/service-level' },
  ],
  social: [
    { name: 'Facebook', href: SOCIAL_LINKS.facebook, icon: '�' },
    { name: 'WhatsApp', href: SOCIAL_LINKS.whatsapp, icon: '📱' },
    { name: 'Email', href: SOCIAL_LINKS.email, icon: '�' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center justify-center md:justify-start">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-orange-500/20">
                <Image 
                  src="/images/logo.png" 
                  alt="AMG Real Estate Logo" 
                  width={40} 
                  height={40} 
                  className="object-contain"
                />
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              {COMPANY_INFO.fullNameAr}. تأسست عام {COMPANY_INFO.founded} وهي رائدة في مجال المقاولات والتشطيبات والتسويق العقاري.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <PhoneIcon className="w-5 h-5 text-orange-400" />
                <span>{COMPANY_INFO.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <EnvelopeIcon className="w-5 h-5 text-yellow-400" />
                <span>{COMPANY_INFO.email}</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-300">
                <MapPinIcon className="w-5 h-5 text-orange-400 mt-1" />
                <div className="space-y-1" suppressHydrationWarning={true}>
                  <div>{COMPANY_INFO.locations.portSaid.cityAr}: {COMPANY_INFO.locations.portSaid.address}</div>
                  <div>{COMPANY_INFO.locations.cairo.cityAr}: {COMPANY_INFO.locations.cairo.address}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">روابط سريعة</h3>
            <ul className="space-y-3">
              {footerNavigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">خدماتنا</h3>
            <ul className="space-y-3">
              {footerNavigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">ابق على تواصل</h3>
            
            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-gray-300 mb-4">اشترك في نشرتنا الإخبارية</p>
              <div className="flex flex-col space-y-3">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                />
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300">
                  اشترك
                </button>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-gray-300 mb-4">تابعنا على</p>
              <div className="grid grid-cols-3 gap-3">
                {footerNavigation.social.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-300 transform hover:scale-110"
                    aria-label={item.name}
                  >
                    <span className="text-lg">{item.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-gray-400 text-sm">
            © 2025 AMG Real Estate. جميع الحقوق محفوظة.
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap gap-6 text-sm">
            {footerNavigation.legal.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors duration-300 transform hover:scale-110"
            aria-label="Back to top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}
