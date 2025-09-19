'use client'

import { useState, useEffect, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowRightIcon,
  MapPinIcon,
  HomeIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { Badge, Button, Notification } from '@/components/ui'
import { useAuth } from '@/lib/AuthContext'
import { Lightbox } from '@/components/ui'

interface PropertyData {
  id: string
  title: string
  description: string
  price: number
  currency: 'EGP' | 'USD'
  area: number
  bedrooms?: number
  bathrooms?: number
  parking: boolean
  furnished: boolean
  city: string
  district: string
  address: string
  latitude?: number
  longitude?: number
  propertyType: string
  purpose: string
  features: string[]
  views: number
  contactName: string
  contactPhone: string
  contactEmail: string
  createdAt: string
  updatedAt: string
  images: Array<{
    id: string
    url: string
    alt: string
    isMain: boolean
    order: number
  }>
  owner: {
    id: string
    firstName: string
    lastName: string
    userType: string
    verified: boolean
    memberSince: string
  }
  stats: {
    views: number
    favorites: number
    inquiries: number
  }
}

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const resolvedParams = use(params)
  const [property, setProperty] = useState<PropertyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [showInquiryForm, setShowInquiryForm] = useState(false)
  const [inquiryLoading, setInquiryLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  const { user } = useAuth()

  // جلب بيانات العقار
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${resolvedParams.id}/public`)
        const data = await response.json()

        if (!data.success) {
          setError(data.message || 'فشل في جلب بيانات العقار')
          return
        }

        setProperty(data.data)
        
        // تسجيل مشاهدة العقار
        await fetch(`/api/properties/${resolvedParams.id}/view`, {
          method: 'POST',
          credentials: 'include'
        })

        // التحقق من حالة المفضلة إذا كان المستخدم مسجل دخوله
        if (user) {
          const favoriteResponse = await fetch(`/api/properties/${resolvedParams.id}/favorite`, {
            credentials: 'include'
          })
          const favoriteData = await favoriteResponse.json()
          if (favoriteData.success) {
            setIsFavorite(favoriteData.isFavorite)
          }
        }

      } catch (error) {
        console.error('Error fetching property:', error)
        setError('حدث خطأ في جلب بيانات العقار')
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [resolvedParams.id, user])

  // دوال المساعدة
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: currency === 'EGP' ? 'EGP' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getTypeText = (type: string) => {
    const types: { [key: string]: string } = {
      APARTMENT: 'شقة',
      VILLA: 'فيلا',
      OFFICE: 'مكتب',
      COMMERCIAL: 'تجاري',
      LAND: 'أرض'
    }
    return types[type] || type
  }

  const getPurposeText = (purpose: string) => {
    return purpose === 'SALE' ? 'للبيع' : 'للإيجار'
  }

  const handleNextImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const handlePrevImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      )
    }
  }

  const handleToggleFavorite = async () => {
    if (!user) {
      setToast({ message: 'يجب تسجيل الدخول أولاً', type: 'error' })
      return
    }

    try {
      const response = await fetch(`/api/properties/${resolvedParams.id}/favorite`, {
        method: isFavorite ? 'DELETE' : 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        setIsFavorite(!isFavorite)
        setToast({ 
          message: isFavorite ? 'تم إزالة العقار من المفضلة' : 'تم إضافة العقار للمفضلة', 
          type: 'success' 
        })
      }
    } catch (error) {
      setToast({ message: 'حدث خطأ', type: 'error' })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: property?.description,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      setToast({ message: 'تم نسخ الرابط', type: 'success' })
    }
  }

  const handleInquiry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setInquiryLoading(true)

    const formData = new FormData(e.currentTarget)
    const inquiryData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
      propertyId: resolvedParams.id
    }

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData),
        credentials: 'include'
      })

      if (response.ok) {
        setToast({ message: 'تم إرسال الاستفسار بنجاح', type: 'success' })
        setShowInquiryForm(false)
      } else {
        setToast({ message: 'فشل في إرسال الاستفسار', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'حدث خطأ', type: 'error' })
    } finally {
      setInquiryLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !property) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              الرئيسية
            </Link>
            <ArrowRightIcon className="w-4 h-4 text-gray-400" />
            <Link href="/properties" className="text-blue-600 hover:text-blue-800">
              العقارات
            </Link>
            <ArrowRightIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 truncate">{property.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* معرض الصور والتفاصيل الرئيسية */}
          <div className="lg:col-span-2 space-y-6">
            {/* معرض الصور */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {property.images.length > 0 ? (
                <div className="relative h-96 sm:h-[500px]">
                  <Image
                    src={property.images[currentImageIndex]?.url}
                    alt={property.images[currentImageIndex]?.alt || property.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* أزرار التنقل */}
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronLeftIcon className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronRightIcon className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* مؤشر الصور */}
                  {property.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {property.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* زر تكبير الصورة */}
                  <button
                    onClick={() => setShowLightbox(true)}
                    className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <MagnifyingGlassPlusIcon className="w-5 h-5" />
                  </button>

                  {/* شارات */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge variant={property.purpose === 'SALE' ? 'info' : 'warning'}>
                      {getPurposeText(property.purpose)}
                    </Badge>
                    <Badge variant="default">
                      {getTypeText(property.propertyType)}
                    </Badge>
                  </div>

                  {/* إحصائيات */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs">
                      <EyeIcon className="w-3 h-3" />
                      <span>{property.stats.views}</span>
                    </div>
                    <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs">
                      <HeartIcon className="w-3 h-3" />
                      <span>{property.stats.favorites}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-96 sm:h-[500px] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <HomeIcon className="w-24 h-24 text-white opacity-50" />
                </div>
              )}

              {/* صور مصغرة */}
              {property.images.length > 1 && (
                <div className="p-4 border-t">
                  <div className="flex gap-2 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                          index === currentImageIndex ? 'border-blue-500' : 'border-gray-300'
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* تفاصيل العقار */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {property.title}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="w-5 h-5 ml-2" />
                  <span>{property.district}, {property.city}</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(property.price, property.currency)}
                </div>
              </div>

              {/* مواصفات العقار */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <HomeIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">المساحة</p>
                  <p className="font-semibold">{property.area} م²</p>
                </div>

                {property.bedrooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                      <span className="text-blue-500 text-2xl">🛏️</span>
                    </div>
                    <p className="text-sm text-gray-600">الغرف</p>
                    <p className="font-semibold">{property.bedrooms}</p>
                  </div>
                )}

                {property.bathrooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                      <span className="text-blue-500 text-2xl">🚿</span>
                    </div>
                    <p className="text-sm text-gray-600">الحمامات</p>
                    <p className="font-semibold">{property.bathrooms}</p>
                  </div>
                )}

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                    <span className="text-blue-500 text-2xl">🚗</span>
                  </div>
                  <p className="text-sm text-gray-600">موقف</p>
                  <p className="font-semibold">{property.parking ? 'متوفر' : 'غير متوفر'}</p>
                </div>
              </div>

              {/* الوصف */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">وصف العقار</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* المميزات */}
              {property.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">المميزات</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* العنوان */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">الموقع</h3>
                <p className="text-gray-700 mb-4">{property.address}</p>
                
                {/* الخريطة */}
                {property.latitude && property.longitude && (
                  <div className="h-64 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-600">خريطة الموقع</p>
                    {/* يمكن إضافة مكون الخريطة هنا لاحقاً */}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* الشريط الجانبي */}
          <div className="space-y-6">
            {/* أزرار الإجراءات */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="space-y-4">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setShowInquiryForm(true)}
                >
                  <ChatBubbleLeftIcon className="w-5 h-5 ml-2" />
                  استفسار عن العقار
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={isFavorite ? "secondary" : "outline"}
                    onClick={handleToggleFavorite}
                    className="flex items-center justify-center"
                  >
                    {isFavorite ? (
                      <HeartIconSolid className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex items-center justify-center"
                  >
                    <ShareIcon className="w-5 h-5" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowContactInfo(!showContactInfo)}
                >
                  <PhoneIcon className="w-5 h-5 ml-2" />
                  معلومات التواصل
                </Button>

                <AnimatePresence>
                  {showContactInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t pt-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">الاسم:</span>
                          <span className="font-semibold">{property.contactName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">الهاتف:</span>
                          <a 
                            href={`tel:${property.contactPhone}`}
                            className="font-semibold text-blue-600 hover:text-blue-800"
                          >
                            {property.contactPhone}
                          </a>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">البريد:</span>
                          <a 
                            href={`mailto:${property.contactEmail}`}
                            className="font-semibold text-blue-600 hover:text-blue-800 truncate"
                          >
                            {property.contactEmail}
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* معلومات المالك */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">معلومات المالك</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {property.owner.firstName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold flex items-center gap-2">
                      {property.owner.firstName} {property.owner.lastName}
                      {property.owner.verified && (
                        <CheckCircleIcon className="w-4 h-4 text-blue-500" />
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      عضو منذ {new Date(property.owner.memberSince).getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* إحصائيات العقار */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">إحصائيات العقار</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <EyeIcon className="w-4 h-4" />
                    المشاهدات
                  </span>
                  <span className="font-semibold">{property.stats.views}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <HeartIcon className="w-4 h-4" />
                    المفضلة
                  </span>
                  <span className="font-semibold">{property.stats.favorites}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <ChatBubbleLeftIcon className="w-4 h-4" />
                    الاستفسارات
                  </span>
                  <span className="font-semibold">{property.stats.inquiries}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox للصور */}
      {showLightbox && property.images.length > 0 && (
        <Lightbox
          isOpen={showLightbox}
          images={property.images.map(img => img.url)}
          currentIndex={currentImageIndex}
          onClose={() => setShowLightbox(false)}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
        />
      )}

      {/* نموذج الاستفسار */}
      <AnimatePresence>
        {showInquiryForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowInquiryForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">استفسار عن العقار</h3>
                <button
                  onClick={() => setShowInquiryForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleInquiry} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue={user ? `${user.firstName} ${user.lastName}` : ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue={user?.email || ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue={user?.phone || ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رسالة الاستفسار
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أريد معرفة المزيد عن هذا العقار..."
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={inquiryLoading}
                  >
                    {inquiryLoading ? 'جاري الإرسال...' : 'إرسال الاستفسار'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowInquiryForm(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* إشعارات */}
      {toast && (
        <Notification
          title={toast.type === 'success' ? 'نجح' : 'خطأ'}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}