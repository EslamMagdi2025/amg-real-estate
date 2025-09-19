'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  HomeIcon,
  PencilIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useAuth, withAuth } from '@/lib/AuthContext'

interface Property {
  id: string
  title: string
  description: string
  price: number
  currency: string
  area: number
  bedrooms?: number
  bathrooms?: number
  city: string
  district: string
  propertyType: string
  purpose: string
  status: string
  images: any[]
}

function EditPropertyPage() {
  const { user } = useAuth()
  const { id } = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // بيانات النموذج
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    currency: 'EGP',
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    city: '',
    district: '',
    propertyType: '',
    purpose: ''
  })

  // تحميل بيانات العقار
  useEffect(() => {
    if (id) {
      fetchProperty()
    }
  }, [id])

  const fetchProperty = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/properties/${id}`)
      
      if (response.ok) {
        const data = await response.json()
        setProperty(data.property)
        setFormData({
          title: data.property.title,
          description: data.property.description,
          price: data.property.price,
          currency: data.property.currency,
          area: data.property.area,
          bedrooms: data.property.bedrooms || 0,
          bathrooms: data.property.bathrooms || 0,
          city: data.property.city,
          district: data.property.district,
          propertyType: data.property.propertyType,
          purpose: data.property.purpose
        })
      } else {
        setError('فشل في تحميل بيانات العقار')
      }
    } catch (error) {
      console.error('خطأ في تحميل العقار:', error)
      setError('خطأ في تحميل بيانات العقار')
    } finally {
      setLoading(false)
    }
  }

  // حفظ التعديلات
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // تأكيد الإرسال
    const confirmSend = window.confirm(
      'هل أنت متأكد من رغبتك في حفظ التعديلات؟\n' +
      'سيتم إرسال إشعار تلقائي للمسؤولين بأن العقار تم تعديله وجاهز للمراجعة.'
    )
    
    if (!confirmSend) {
      return
    }
    
    try {
      setSaving(true)
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        // إرسال إشعار للمستخدم بنجاح التعديل
        try {
          await fetch('/api/notifications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'PROPERTY_EDIT_SUBMITTED',
              title: 'تم حفظ التعديلات بنجاح',
              message: `تم حفظ تعديلاتك على العقار "${formData.title}" بنجاح. سيتم مراجعة التعديلات من قبل فريقنا قريباً.`,
              relatedId: id,
              metadata: {
                propertyTitle: formData.title,
                editedAt: new Date().toISOString()
              }
            })
          })
        } catch (notificationError) {
          console.error('خطأ في إرسال الإشعار:', notificationError)
          // لا نوقف العملية إذا فشل الإشعار
        }

        // عرض رسالة نجاح
        alert('✅ تم حفظ التعديلات بنجاح!\n\nسيتم مراجعة التعديلات من قبل فريقنا وستحصل على إشعار بالنتيجة.')
        
        // إعادة توجيه إلى لوحة التحكم
        router.push('/dashboard')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'فشل في حفظ التعديلات')
      }
    } catch (error) {
      console.error('خطأ في حفظ العقار:', error)
      setError('خطأ في حفظ التعديلات')
    } finally {
      setSaving(false)
    }
  }

  // معالجة تغيير المدخلات
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'area' || name === 'bedrooms' || name === 'bathrooms' 
        ? parseInt(value) || 0 
        : value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-12 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-900 mb-2">خطأ في تحميل العقار</h2>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              العودة
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500 mb-4">
            <HomeIcon className="h-4 w-4" />
            <span>العقارات</span>
            <span>/</span>
            <span>{property?.title}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">تعديل</span>
          </nav>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <PencilIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                تعديل العقار
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                قم بتعديل بيانات عقارك وحفظ التغييرات
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              البيانات الأساسية
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* عنوان العقار */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عنوان العقار *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل عنوان العقار"
                />
              </div>

              {/* وصف العقار */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  وصف العقار *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل وصف مفصل للعقار"
                />
              </div>

              {/* السعر */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  السعر *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل السعر"
                />
              </div>

              {/* العملة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  العملة
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="EGP">جنيه مصري</option>
                  <option value="USD">دولار أمريكي</option>
                  <option value="EUR">يورو</option>
                </select>
              </div>

              {/* المساحة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  المساحة (م²) *
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل المساحة"
                />
              </div>

              {/* عدد الغرف */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عدد غرف النوم
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="عدد غرف النوم"
                />
              </div>

              {/* عدد الحمامات */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عدد الحمامات
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="عدد الحمامات"
                />
              </div>

              {/* المدينة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  المدينة *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل المدينة"
                />
              </div>

              {/* المنطقة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  المنطقة *
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل المنطقة"
                />
              </div>

              {/* نوع العقار */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  نوع العقار *
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">اختر نوع العقار</option>
                  <option value="APARTMENT">شقة</option>
                  <option value="VILLA">فيلا</option>
                  <option value="HOUSE">منزل</option>
                  <option value="OFFICE">مكتب</option>
                  <option value="SHOP">محل تجاري</option>
                  <option value="LAND">أرض</option>
                </select>
              </div>

              {/* الغرض */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الغرض *
                </label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">اختر الغرض</option>
                  <option value="SALE">للبيع</option>
                  <option value="RENT">للإيجار</option>
                </select>
              </div>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              إلغاء
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 space-x-reverse px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4" />
                  <span>حفظ التعديلات</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default withAuth(EditPropertyPage)