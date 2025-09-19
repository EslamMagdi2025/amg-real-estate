'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  HeartIcon,
  HomeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TrashIcon,
  ArrowLeftIcon,
  BuildingOffice2Icon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useAuth, withAuth } from '@/lib/AuthContext'
import Link from 'next/link'
import Image from 'next/image'

// تعريف نوع البيانات
interface FavoriteProperty {
  id: string
  addedAt: string
  property: {
    id: string
    title: string
    description: string
    price: string
    currency: string
    area: number
    bedrooms?: number
    bathrooms?: number
    parking: boolean
    furnished: boolean
    city: string
    district: string
    address: string
    propertyType: string
    purpose: string
    status: string
    views: number
    contactName: string
    contactPhone: string
    contactEmail: string
    mainImage: string | null
    createdAt: string
    owner: {
      name: string
      phone: string
      email: string
    }
  }
}

// دالة تنسيق التاريخ
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// دالة تنسيق السعر
const formatPrice = (price: string, currency: string) => {
  const numPrice = parseFloat(price)
  return `${numPrice.toLocaleString()} ${currency === 'EGP' ? 'جنيه' : 'دولار'}`
}

// دالة تنسيق نوع العقار
const getPropertyTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    APARTMENT: 'شقة',
    VILLA: 'فيلا',
    HOUSE: 'منزل',
    OFFICE: 'مكتب',
    SHOP: 'محل',
    LAND: 'أرض',
    BUILDING: 'مبنى',
    CHALET: 'شاليه',
    DUPLEX: 'دوبلكس',
    PENTHOUSE: 'بنتهاوس'
  }
  return types[type] || type
}

// دالة تنسيق الغرض
const getPurposeLabel = (purpose: string) => {
  const purposes: Record<string, string> = {
    SALE: 'للبيع',
    RENT: 'للإيجار',
    BOTH: 'للبيع والإيجار'
  }
  return purposes[purpose] || purpose
}

function FavoritesPage() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set())

  // جلب المفضلة
  const fetchFavorites = async (search = '') => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      
      const response = await fetch(`/api/user/favorites?${params}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setFavorites(data.favorites)
        setError(null)
      } else {
        setError(data.message || 'حدث خطأ أثناء جلب المفضلة')
      }
    } catch (err) {
      console.error('Error fetching favorites:', err)
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  // إزالة من المفضلة
  const removeFromFavorites = async (propertyId: string) => {
    try {
      setRemovingIds(prev => new Set([...prev, propertyId]))
      
      const response = await fetch('/api/user/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyId })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // إزالة العقار من القائمة محلياً
        setFavorites(prev => prev.filter(fav => fav.property.id !== propertyId))
      } else {
        setError(data.message || 'حدث خطأ أثناء إزالة العقار من المفضلة')
      }
    } catch (err) {
      console.error('Error removing from favorites:', err)
      setError('حدث خطأ في الاتصال')
    } finally {
      setRemovingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(propertyId)
        return newSet
      })
    }
  }

  // البحث
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    fetchFavorites(term)
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <HeartSolidIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              مفضلتي
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            هنا تجد جميع العقارات التي أضفتها إلى المفضلة. يمكنك مراجعتها في أي وقت والتواصل مع أصحابها مباشرة.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-2xl p-6 shadow-lg">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في المفضلة..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Back Button */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              العودة للداشبورد
            </Link>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل المفضلة...</p>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartIcon className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">حدث خطأ</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchFavorites(searchTerm)}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
            >
              إعادة المحاولة
            </button>
          </motion.div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'لا توجد نتائج' : 'لا توجد مفضلة'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'لم نجد أي عقارات تطابق بحثك في المفضلة' 
                : 'لم تضف أي عقارات إلى المفضلة بعد. ابدأ في استكشاف العقارات وإضافة ما يعجبك!'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/properties"
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
              >
                استكشف العقارات
              </Link>
              {searchTerm && (
                <button
                  onClick={() => handleSearch('')}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                >
                  إظهار جميع المفضلة
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite, index) => (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Property Image */}
                <div className="relative h-48 overflow-hidden">
                  {favorite.property.mainImage ? (
                    <Image
                      src={favorite.property.mainImage}
                      alt={favorite.property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <HomeIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Remove from Favorites Button */}
                  <button
                    onClick={() => removeFromFavorites(favorite.property.id)}
                    disabled={removingIds.has(favorite.property.id)}
                    className="absolute top-3 left-3 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all group-hover:scale-110 disabled:opacity-50"
                  >
                    {removingIds.has(favorite.property.id) ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <TrashIcon className="w-5 h-5 text-red-500" />
                    )}
                  </button>

                  {/* Property Type & Purpose Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                    {getPropertyTypeLabel(favorite.property.propertyType)} • {getPurposeLabel(favorite.property.purpose)}
                  </div>

                  {/* Views Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <EyeIcon className="w-3 h-3" />
                    {favorite.property.views}
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  {/* Title & Price */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {favorite.property.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-green-600 font-bold">
                        <CurrencyDollarIcon className="w-5 h-5" />
                        {formatPrice(favorite.property.price, favorite.property.currency)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {favorite.property.area} م²
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm line-clamp-1">
                      {favorite.property.district}، {favorite.property.city}
                    </span>
                  </div>

                  {/* Property Features */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    {favorite.property.bedrooms && (
                      <div className="flex items-center gap-1">
                        <BuildingOffice2Icon className="w-4 h-4" />
                        {favorite.property.bedrooms} غرف
                      </div>
                    )}
                    {favorite.property.bathrooms && (
                      <div className="flex items-center gap-1">
                        <HomeIcon className="w-4 h-4" />
                        {favorite.property.bathrooms} حمام
                      </div>
                    )}
                    {favorite.property.parking && (
                      <div className="text-green-600 text-xs">
                        موقف سيارة
                      </div>
                    )}
                  </div>

                  {/* Added Date */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <CalendarIcon className="w-4 h-4" />
                    أُضيف في {formatDate(favorite.addedAt)}
                  </div>

                  {/* Contact & View Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/properties/${favorite.property.id}`}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white text-center py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      عرض التفاصيل
                    </Link>
                    <a
                      href={`tel:${favorite.property.contactPhone}`}
                      className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      <PhoneIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default withAuth(FavoritesPage)