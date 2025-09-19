'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  HomeIcon,
  UserIcon,
  CurrencyDollarIcon,
  EyeIcon,
  HeartIcon,
  PhoneIcon,
  EnvelopeIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'

// واجهة بيانات العقارات
interface Property {
  id: string
  title: string
  description: string
  propertyType: string
  purpose: string
  city: string
  district: string
  address: string
  price: number
  area: number
  bedrooms: number
  bathrooms: number
  views?: number // إضافة المشاهدات
  images: Array<{
    id: string
    url: string
  }>
  user: {
    firstName: string
    lastName: string
    phone?: string
    email?: string
  }
}

export default function ListingsPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    propertyType: '',
    purpose: '',
    minPrice: '',
    maxPrice: '',
    city: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [likedProperties, setLikedProperties] = useState<Set<string>>(new Set())
  const [viewedProperties, setViewedProperties] = useState<Set<string>>(new Set())
  const [totalProperties, setTotalProperties] = useState(0)
  const [contactingProperty, setContactingProperty] = useState<string | null>(null)
  const itemsPerPage = 12

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.propertyType && { propertyType: filters.propertyType }),
        ...(filters.purpose && { purpose: filters.purpose }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.city && { city: filters.city })
      })

      const response = await fetch(`/api/properties/public?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties)
        setTotalPages(data.totalPages)
        setTotalProperties(data.total || data.properties.length)
      } else {
        console.error('فشل في تحميل العقارات')
      }
    } catch (error) {
      console.error('خطأ في تحميل العقارات:', error)
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [currentPage, searchTerm, filters])

  useEffect(() => {
    // Scroll to top when page changes
    if (currentPage > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentPage])

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
    setCurrentPage(1) // إعادة تعيين الصفحة للأولى عند تغيير الفلتر
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchProperties()
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'k') {
          event.preventDefault();
          (document.querySelector('input[type="text"]') as HTMLInputElement)?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-EG').format(price) + ' جنيه'
  }

  const getPropertyTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'APARTMENT': 'شقة',
      'VILLA': 'فيلا',
      'HOUSE': 'منزل',
      'OFFICE': 'مكتب',
      'COMMERCIAL': 'تجاري',
      'LAND': 'أرض'
    }
    return types[type] || type
  }

  const getPurposeLabel = (purpose: string) => {
    return purpose === 'SALE' ? 'للبيع' : 'للإيجار'
  }

  const handleLike = (propertyId: string) => {
    setLikedProperties(prev => {
      const newLikes = new Set(prev)
      if (newLikes.has(propertyId)) {
        newLikes.delete(propertyId)
      } else {
        newLikes.add(propertyId)
      }
      return newLikes
    })
  }

  const handleView = async (propertyId: string) => {
    setViewedProperties(prev => new Set([...prev, propertyId]))
    
    // تسجيل المشاهدة في الخادم
    try {
      await fetch(`/api/properties/${propertyId}/view`, {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.log('Error recording view:', error)
    }
    
    console.log(`عرض تفاصيل العقار: ${propertyId}`)
  }

  const handleContact = async (contactType: 'phone' | 'message', property: Property) => {
    setContactingProperty(property.id)
    
    try {
      if (contactType === 'phone') {
        // فتح تطبيق الهاتف للاتصال  
        const phoneNumber = property.user.phone || '01012345678'
        
        // محاولة فتح تطبيق الهاتف
        const telLink = `tel:${phoneNumber}`
        window.location.href = telLink
        
        // إشعار للمستخدم
        setTimeout(() => {
          alert(`سيتم الاتصال بـ ${property.user.firstName} ${property.user.lastName}\nرقم الهاتف: ${phoneNumber}`)
        }, 500)
        
      } else {
        // فتح WhatsApp للمراسلة
        const phoneNumber = property.user.phone || '01012345678'
        const message = `السلام عليكم ورحمة الله وبركاته\n\nأنا مهتم بالعقار التالي:\n📍 ${property.title}\n🏘️ ${property.city} - ${property.district}\n💰 ${formatPrice(property.price)}\n📐 ${property.area} متر مربع\n\nيرجى التواصل معي للمزيد من التفاصيل.`
        
        // تنظيف رقم الهاتف (إزالة الرموز والمسافات)
        const cleanPhone = phoneNumber.replace(/[^0-9]/g, '')
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
        
        // فتح WhatsApp في نافذة جديدة
        const whatsappWindow = window.open(whatsappUrl, '_blank')
        
        if (!whatsappWindow) {
          alert('يرجى السماح للنوافذ المنبثقة لفتح WhatsApp')
        } else {
          // إشعار نجاح
          setTimeout(() => {
            alert(`تم فتح محادثة WhatsApp مع ${property.user.firstName} ${property.user.lastName}`)
          }, 1000)
        }
      }
      
      // إضافة تأخير قصير للتأثير البصري
      await new Promise(resolve => setTimeout(resolve, 1500))
      
    } catch (error) {
      console.error('خطأ في التواصل:', error)
      alert('حدث خطأ أثناء محاولة التواصل. يرجى المحاولة مرة أخرى.')
    } finally {
      setContactingProperty(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[50vh] flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 text-white"
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative z-10 text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 px-4">
            إعلانات العقارات
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 px-4">
            اكتشف العقارات المتاحة من المستخدمين
          </p>
        </motion.div>
      </motion.section>

      {/* Search and Filters */}
      <motion.section 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="py-12 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar - Enhanced */}
          <div className="relative mb-8">
            <div className="flex rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 overflow-hidden shadow-2xl shadow-blue-600/10">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن العقارات بالعنوان أو المنطقة... (Ctrl+K)"
                  className="w-full pl-12 pr-6 py-5 text-lg focus:outline-none bg-transparent placeholder-gray-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-5 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filters - Enhanced Design */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
              <div className="relative group">
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="w-full appearance-none bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 cursor-pointer hover:shadow-md group-hover:border-blue-300"
                >
                  <option value="">جميع الأنواع</option>
                  <option value="APARTMENT">شقة</option>
                  <option value="VILLA">فيلا</option>
                  <option value="HOUSE">منزل</option>
                  <option value="OFFICE">مكتب</option>
                  <option value="COMMERCIAL">تجاري</option>
                  <option value="LAND">أرض</option>
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <HomeIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="relative group">
                <select
                  value={filters.purpose}
                  onChange={(e) => handleFilterChange('purpose', e.target.value)}
                  className="w-full appearance-none bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 cursor-pointer hover:shadow-md group-hover:border-blue-300"
                >
                  <option value="">الغرض</option>
                  <option value="SALE">للبيع</option>
                  <option value="RENT">للإيجار</option>
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <TagIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="relative group">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="أقل سعر"
                  className="w-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 pl-10 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 hover:shadow-md group-hover:border-blue-300"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="relative group">
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="أعلى سعر"
                  className="w-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 pl-10 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 hover:shadow-md group-hover:border-blue-300"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  placeholder="المدينة"
                  className="w-full bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 pl-10 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 hover:shadow-md group-hover:border-blue-300"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Properties Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Counter */}
          {!loading && properties.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full ml-2 animate-pulse"></div>
                <span className="text-gray-700 font-medium">
                  تم العثور على <span className="text-blue-600 font-bold">{totalProperties}</span> عقار
                </span>
              </div>
              <div className="text-sm text-gray-500">
                الصفحة {currentPage} من {totalPages}
              </div>
            </motion.div>
          )}

          {loading && initialLoad ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-100 border-t-blue-600 mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <HomeIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <p className="mt-6 text-lg text-gray-600 font-medium">جاري البحث عن العقارات المناسبة لك...</p>
              <div className="mt-4 flex justify-center space-x-1 space-x-reverse">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </motion.div>
          ) : properties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <HomeIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                لا توجد عقارات متاحة
              </h3>
              <p className="text-gray-500">
                لم يتم العثور على عقارات تطابق معايير البحث الخاصة بك
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6"
            >
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                >
                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={property.images[0]?.url || '/images/placeholder.jpg'}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg ${
                        property.purpose === 'SALE' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {getPurposeLabel(property.purpose)}
                      </span>
                    </div>

                    {/* Property Type Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800 shadow-lg">
                        {getPropertyTypeLabel(property.propertyType)}
                      </span>
                    </div>

                    {/* Views Badge */}
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs">
                        <EyeIcon className="w-3 h-3" />
                        <span>{property.views || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {formatPrice(property.price)}
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
                        #{property.id.slice(-6)}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {property.title}
                    </h3>
                    
                    {/* Location */}
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPinIcon className="h-4 w-4 ml-2 text-blue-500" />
                      <span className="font-medium text-sm">{property.city} - {property.district}</span>
                    </div>

                    {/* Property Details */}
                    <div className="flex items-center justify-between mb-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-3 border border-gray-100">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="bg-blue-500 rounded-full p-2">
                          <HomeIcon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span className="text-lg font-bold text-gray-900">{property.area}</span>
                          <span className="text-sm text-gray-600 mr-1">متر²</span>
                        </div>
                      </div>
                      
                      {property.bedrooms > 0 && (
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className="bg-purple-500 rounded-full p-2">
                            <span className="text-white text-sm font-bold">🛏️</span>
                          </div>
                          <div>
                            <span className="text-lg font-bold text-gray-900">{property.bedrooms}</span>
                            <span className="text-sm text-gray-600 mr-1">غرفة</span>
                          </div>
                        </div>
                      )}
                      
                      {property.bathrooms > 0 && (
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className="bg-cyan-500 rounded-full p-2">
                            <span className="text-white text-sm font-bold">🚿</span>
                          </div>
                          <div>
                            <span className="text-lg font-bold text-gray-900">{property.bathrooms}</span>
                            <span className="text-sm text-gray-600 mr-1">حمام</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {property.user.firstName[0]}{property.user.lastName[0]}
                        </div>
                        <div className="mr-3">
                          <p className="text-sm font-semibold text-gray-800">
                            {property.user.firstName} {property.user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {property.user.phone || '01012345678'}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                        متاح للتواصل
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {/* Details Button */}
                      <Link href={`/properties/${property.id}`} className="block">
                        <button 
                          onClick={() => handleView(property.id)}
                          className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-1"
                        >
                          <EyeIcon className="h-4 w-4 ml-2" />
                          تفاصيل أكثر
                        </button>
                      </Link>
                      
                      {/* Contact Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleContact('phone', property)}
                          disabled={contactingProperty === property.id}
                          className={`py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm font-medium ${
                            contactingProperty === property.id
                              ? 'bg-gray-400 cursor-not-allowed text-white'
                              : 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg hover:-translate-y-1'
                          }`}
                        >
                          {contactingProperty === property.id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent ml-2"></div>
                              جاري...
                            </>
                          ) : (
                            <>
                              <PhoneIcon className="h-3 w-3 ml-2" />
                              اتصال
                            </>
                          )}
                        </button>
                        
                        <button 
                          onClick={() => handleContact('message', property)}
                          disabled={contactingProperty === property.id}
                          className={`py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm font-medium ${
                            contactingProperty === property.id
                              ? 'bg-gray-400 cursor-not-allowed text-white'
                              : 'bg-purple-500 hover:bg-purple-600 text-white shadow-md hover:shadow-lg hover:-translate-y-1'
                          }`}
                        >
                          {contactingProperty === property.id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent ml-2"></div>
                              جاري...
                            </>
                          ) : (
                            <>
                              <ChatBubbleLeftRightIcon className="h-3 w-3 ml-2" />
                              واتساب
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Loading indicator for pagination */}
          {loading && !initialLoad && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-8"
            >
              <div className="flex items-center space-x-2 space-x-reverse bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-100 border-t-blue-600"></div>
                <span className="text-sm text-gray-600">جاري التحديث...</span>
              </div>
            </motion.div>
          )}

          {/* Pagination - Enhanced */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex justify-center items-center mt-16"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20 flex items-center space-x-2 space-x-reverse">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition-all duration-300 text-gray-700 font-medium disabled:hover:bg-transparent"
                >
                  السابق
                </button>
                
                <div className="flex items-center space-x-1 space-x-reverse mx-2">
                  {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index;
                    } else {
                      pageNumber = currentPage - 2 + index;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-10 h-10 rounded-xl transition-all duration-300 font-medium ${
                          currentPage === pageNumber
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition-all duration-300 text-gray-700 font-medium disabled:hover:bg-transparent"
                >
                  التالي
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}