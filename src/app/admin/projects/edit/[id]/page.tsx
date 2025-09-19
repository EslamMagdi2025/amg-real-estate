// Admin Edit Project Page
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import AdminSidebar from '@/components/admin/AdminSidebar'

// Available project features
const availableFeatures = [
  'حمام سباحة',
  'جيم ومركز لياقة',
  'حديقة ومناطق خضراء',
  'أمن وحراسة 24 ساعة',
  'جراج مغطى',
  'مصعد',
  'انترنت عالي السرعة',
  'غرفة أطفال',
  'مولد كهربائي احتياطي',
  'تكييف مركزي',
  'شرفة أو بلكونة',
  'مطبخ مجهز',
  'نادي اجتماعي',
  'ملعب أطفال',
  'مراكز تسوق قريبة',
  'مواصلات عامة',
  'مدارس وجامعات قريبة',
  'مستشفيات قريبة',
  'موقع متميز',
  'إطلالة بحرية',
  'إطلالة على حديقة',
  'قريب من المطار',
  'منطقة هادئة',
  'خدمة صيانة'
]

interface ProjectImage {
  id: string
  url: string
  alt?: string
  isMain: boolean
  order: number
}

interface ProjectData {
  id: string
  title: string
  description: string
  location: string
  developer: string
  projectType: 'RESIDENTIAL' | 'COMMERCIAL' | 'MIXED_USE' | 'INDUSTRIAL'
  status: 'PLANNING' | 'UNDER_CONSTRUCTION' | 'COMPLETED' | 'ON_HOLD'
  totalUnits?: number
  availableUnits?: number
  minPrice?: number
  maxPrice?: number
  currency: 'EGP' | 'USD' | 'EUR'
  deliveryDate?: string
  area?: number
  bedrooms?: number
  amenities?: string
  features?: string[]
  specifications?: any
  paymentPlan?: any[]
  locationDetails?: any
  contactName: string
  contactPhone: string
  contactEmail: string
  images?: ProjectImage[]
  mainImage?: string
  featured?: boolean
  published?: boolean
}

interface EditProjectPageProps {
  params: Promise<{ id: string }>
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const router = useRouter()
  const [projectId, setProjectId] = useState<string>('')
  const [formData, setFormData] = useState<ProjectData>({
    id: '',
    title: '',
    description: '',
    location: '',
    developer: '',
    projectType: 'RESIDENTIAL',
    status: 'PLANNING',
    currency: 'EGP',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    features: [],
    specifications: {},
    paymentPlan: [],
    locationDetails: { nearby: [] },
    featured: false,
    published: false
  })
  
  const [images, setImages] = useState<ProjectImage[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setProjectId(resolvedParams.id)
      fetchProject(resolvedParams.id)
    }
    getParams()
  }, [params])

  const fetchProject = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/projects/${id}`)
      const data = await response.json()

      if (data.success) {
        const project = data.data
        
        // Parse features from JSON string to array
        let parsedFeatures: string[] = []
        if (project.features) {
          try {
            parsedFeatures = typeof project.features === 'string' 
              ? JSON.parse(project.features)
              : Array.isArray(project.features) 
                ? project.features
                : []
          } catch {
            // If it's not valid JSON, try to split by comma
            parsedFeatures = typeof project.features === 'string'
              ? project.features.split(',').map((f: string) => f.trim()).filter(Boolean)
              : []
          }
        }
        
        // Parse other JSON fields
        let parsedPaymentPlan: any[] = []
        if (project.paymentPlan) {
          try {
            parsedPaymentPlan = typeof project.paymentPlan === 'string'
              ? JSON.parse(project.paymentPlan)
              : Array.isArray(project.paymentPlan)
                ? project.paymentPlan
                : []
          } catch {
            parsedPaymentPlan = []
          }
        }

        let parsedLocationDetails: any = { nearby: [] }
        if (project.locationDetails) {
          try {
            parsedLocationDetails = typeof project.locationDetails === 'string'
              ? JSON.parse(project.locationDetails)
              : project.locationDetails
          } catch {
            parsedLocationDetails = { nearby: [] }
          }
        }
        
        setFormData({
          ...project,
          features: parsedFeatures,
          paymentPlan: parsedPaymentPlan,
          locationDetails: parsedLocationDetails,
          deliveryDate: project.deliveryDate ? new Date(project.deliveryDate).toISOString().split('T')[0] : ''
        })
        setImages(project.images || [])
      } else {
        setError(data.message || 'خطأ في جلب بيانات المشروع')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      setError('خطأ في جلب بيانات المشروع')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...(prev.features || []), feature]
    }))
  }

  const addImageByUrl = async () => {
    if (newImageUrl.trim() && projectId) {
      try {
        const response = await fetch(`/api/admin/projects/${projectId}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: newImageUrl.trim(),
            alt: 'صورة جديدة'
          }),
        })

        const data = await response.json()

        if (data.success) {
          await fetchProject(projectId)
          setNewImageUrl('')
          setSuccess('تم إضافة الصورة بنجاح!')
          setTimeout(() => setSuccess(null), 3000)
        } else {
          setError(data.message || 'خطأ في إضافة الصورة')
          setTimeout(() => setError(null), 5000)
        }
      } catch (error) {
        console.error('Error adding image:', error)
        setError('خطأ في إضافة الصورة')
        setTimeout(() => setError(null), 5000)
      }
    }
  }

  const uploadImage = async (file: File) => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      // رفع الصورة إلى Cloudinary
      const uploadResponse = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadResponse.json()

      if (uploadData.success) {
        // إضافة الصورة للمشروع
        const addImageResponse = await fetch(`/api/admin/projects/${projectId}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: uploadData.data.url,
            alt: `صورة جديدة`
          }),
        })

        const addImageData = await addImageResponse.json()

        if (addImageData.success) {
          // إعادة جلب بيانات المشروع المحدثة
          await fetchProject(projectId)
          setSuccess('تم رفع الصورة بنجاح!')
          setTimeout(() => setSuccess(null), 3000)
        } else {
          setError(addImageData.message || 'خطأ في إضافة الصورة للمشروع')
          setTimeout(() => setError(null), 5000)
        }
      } else {
        setError(uploadData.message || 'خطأ في رفع الصورة')
        setTimeout(() => setError(null), 5000)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setError('خطأ في رفع الصورة')
      setTimeout(() => setError(null), 5000)
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadImage(file)
    }
  }

  const removeImage = async (index: number) => {
    const imageToRemove = images[index]
    
    try {
      // حذف الصورة من قاعدة البيانات
      const response = await fetch(`/api/admin/projects/${projectId}/images`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId: imageToRemove.id
        }),
      })

      const data = await response.json()

      if (data.success) {
        // إعادة جلب بيانات المشروع المحدثة
        await fetchProject(projectId)
        setSuccess('تم حذف الصورة بنجاح!')
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(data.message || 'خطأ في حذف الصورة')
        setTimeout(() => setError(null), 5000)
      }
    } catch (error) {
      console.error('Error removing image:', error)
      setError('خطأ في حذف الصورة')
      setTimeout(() => setError(null), 5000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const submitData = {
        ...formData,
        totalUnits: formData.totalUnits ? parseInt(formData.totalUnits.toString()) : undefined,
        availableUnits: formData.availableUnits ? parseInt(formData.availableUnits.toString()) : undefined,
        minPrice: formData.minPrice ? parseFloat(formData.minPrice.toString()) : undefined,
        maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice.toString()) : undefined,
        area: formData.area ? parseInt(formData.area.toString()) : undefined,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms.toString()) : undefined,
        features: formData.features || [],
        paymentPlan: formData.paymentPlan || [],
        locationDetails: formData.locationDetails || { nearby: [] }
      }

      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('تم تحديث المشروع بنجاح!')
        setTimeout(() => {
          router.push('/admin/projects')
        }, 2000)
      } else {
        setError(data.message || 'خطأ في تحديث المشروع')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      setError('خطأ في تحديث المشروع')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar 
          currentPage="projects" 
          onPageChange={() => {}} 
          adminRole="admin" 
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل بيانات المشروع...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar 
        currentPage="projects" 
        onPageChange={() => {}} 
        adminRole="admin" 
      />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <button
                onClick={() => router.push('/admin/projects')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors w-fit"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                العودة إلى المشاريع
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                تعديل المشروع: {formData.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
          {/* Alert Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md flex items-start text-sm"
            >
              <ExclamationTriangleIcon className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md flex items-start text-sm"
            >
              <CheckIcon className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Main Form Content */}
              <div className="lg:col-span-3 space-y-4">
                {/* Basic Information Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                    المعلومات الأساسية
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        اسم المشروع *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="اسم المشروع"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        الموقع *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="الموقع"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        المطور *
                      </label>
                      <input
                        type="text"
                        name="developer"
                        value={formData.developer}
                        onChange={handleInputChange}
                        required
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="المطور"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        نوع المشروع *
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      >
                        <option value="RESIDENTIAL">سكني</option>
                        <option value="COMMERCIAL">تجاري</option>
                        <option value="MIXED_USE">مختلط</option>
                        <option value="INDUSTRIAL">صناعي</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        حالة المشروع *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      >
                        <option value="PLANNING">قيد التخطيط</option>
                        <option value="UNDER_CONSTRUCTION">تحت الإنشاء</option>
                        <option value="COMPLETED">مكتمل</option>
                        <option value="ON_HOLD">متوقف</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        العملة
                      </label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      >
                        <option value="EGP">جنيه مصري</option>
                        <option value="USD">دولار أمريكي</option>
                        <option value="EUR">يورو</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        تاريخ التسليم
                      </label>
                      <input
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate || ''}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        المساحة (م²)
                      </label>
                      <input
                        type="number"
                        name="area"
                        value={formData.area || ''}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        min="0"
                        placeholder="المساحة بالمتر المربع"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        عدد غرف النوم
                      </label>
                      <input
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms || ''}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        min="0"
                        placeholder="عدد الغرف"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      وصف المشروع *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={2}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      placeholder="وصف المشروع..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      مميزات المشروع
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-3">
                      {availableFeatures.map((feature) => (
                        <div key={feature} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`edit-feature-${feature}`}
                            checked={formData.features?.includes(feature) || false}
                            onChange={() => handleFeatureToggle(feature)}
                            className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`edit-feature-${feature}`}
                            className="mr-2 text-xs text-gray-700 cursor-pointer"
                          >
                            {feature}
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      تم اختيار {formData.features?.length || 0} من {availableFeatures.length} مميزة
                    </p>
                  </div>
                </div>

                {/* Project Details Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                    تفاصيل المشروع
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        إجمالي الوحدات
                      </label>
                      <input
                        type="number"
                        name="totalUnits"
                        value={formData.totalUnits || ''}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="عدد"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        الوحدات المتاحة
                      </label>
                      <input
                        type="number"
                        name="availableUnits"
                        value={formData.availableUnits || ''}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="متاح"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        أقل سعر
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="minPrice"
                        value={formData.minPrice || ''}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="أقل سعر"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        أعلى سعر
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="maxPrice"
                        value={formData.maxPrice || ''}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="أعلى سعر"
                      />
                    </div>

                    <div className="col-span-2 md:col-span-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        تاريخ التسليم المتوقع
                      </label>
                      <input
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate || ''}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    <div className="col-span-2 md:col-span-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        المرافق والخدمات
                      </label>
                      <textarea
                        name="amenities"
                        value={formData.amenities || ''}
                        onChange={handleInputChange}
                        rows={1}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm resize-none"
                        placeholder="المرافق والخدمات..."
                      />
                    </div>

                  </div>
                </div>

                {/* Additional Details Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                    تفاصيل إضافية
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Nearby Places */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        الأماكن القريبة
                      </label>
                      <div className="space-y-2">
                        {formData.locationDetails?.nearby?.map((place: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={place}
                              onChange={(e) => {
                                const newNearby = [...(formData.locationDetails?.nearby || [])]
                                newNearby[index] = e.target.value
                                setFormData(prev => ({
                                  ...prev,
                                  locationDetails: {
                                    ...prev.locationDetails,
                                    nearby: newNearby
                                  }
                                }))
                              }}
                              className="flex-1 px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                              placeholder="مثال: مول كايرو فيستيفال - 15 دقيقة"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newNearby = (formData.locationDetails?.nearby || []).filter((_: any, i: number) => i !== index)
                                setFormData(prev => ({
                                  ...prev,
                                  locationDetails: {
                                    ...prev.locationDetails,
                                    nearby: newNearby
                                  }
                                }))
                              }}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <TrashIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              locationDetails: {
                                ...prev.locationDetails,
                                nearby: [...(prev.locationDetails?.nearby || []), '']
                              }
                            }))
                          }}
                          className="flex items-center gap-1 px-2 py-1 text-blue-600 hover:text-blue-700 text-xs"
                        >
                          <PlusIcon className="w-3 h-3" />
                          إضافة مكان قريب
                        </button>
                      </div>
                    </div>

                    {/* Payment Plan */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        خطة الدفع
                      </label>
                      <div className="space-y-2">
                        {formData.paymentPlan?.map((step: any, index: number) => (
                          <div key={index} className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={step.step || ''}
                              onChange={(e) => {
                                const newPlan = [...(formData.paymentPlan || [])]
                                newPlan[index] = { ...newPlan[index], step: e.target.value }
                                setFormData(prev => ({ ...prev, paymentPlan: newPlan }))
                              }}
                              className="px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                              placeholder="مرحلة الدفع"
                            />
                            <input
                              type="text"
                              value={step.percentage || ''}
                              onChange={(e) => {
                                const newPlan = [...(formData.paymentPlan || [])]
                                newPlan[index] = { ...newPlan[index], percentage: e.target.value }
                                setFormData(prev => ({ ...prev, paymentPlan: newPlan }))
                              }}
                              className="px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                              placeholder="النسبة (مثال: 10%)"
                            />
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={step.description || ''}
                                onChange={(e) => {
                                  const newPlan = [...(formData.paymentPlan || [])]
                                  newPlan[index] = { ...newPlan[index], description: e.target.value }
                                  setFormData(prev => ({ ...prev, paymentPlan: newPlan }))
                                }}
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                                placeholder="الوصف"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newPlan = (formData.paymentPlan || []).filter((_: any, i: number) => i !== index)
                                  setFormData(prev => ({ ...prev, paymentPlan: newPlan }))
                                }}
                                className="p-1 text-red-500 hover:text-red-700"
                              >
                                <TrashIcon className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              paymentPlan: [...(prev.paymentPlan || []), { step: '', percentage: '', description: '' }]
                            }))
                          }}
                          className="flex items-center gap-1 px-2 py-1 text-blue-600 hover:text-blue-700 text-xs"
                        >
                          <PlusIcon className="w-3 h-3" />
                          إضافة مرحلة دفع
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                    معلومات الاتصال
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        اسم جهة الاتصال *
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="اسم المسؤول"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        رقم الهاتف *
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="رقم الهاتف"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        البريد الإلكتروني *
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="البريد الإلكتروني"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-4">
                {/* Images Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                    صور المشروع
                  </h3>
                  
                  <div className="mb-4 space-y-3">
                    {/* Upload File */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        رفع صورة من الجهاز
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>

                    {/* Or URL */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-gray-500">أو</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        رابط الصورة
                      </label>
                      <div className="flex gap-1">
                        <input
                          type="url"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          className="flex-1 px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                          placeholder="https://..."
                        />
                        <button
                          type="button"
                          onClick={addImageByUrl}
                          disabled={!newImageUrl.trim()}
                          className="px-2 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs"
                        >
                          إضافة
                        </button>
                      </div>
                    </div>

                    {uploading && (
                      <div className="flex items-center justify-center py-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-xs text-gray-600">جاري الرفع...</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {images.map((image, index) => (
                      <div key={image.id || `temp-${index}-${image.url}`} className="relative group">
                        <img
                          src={image.url}
                          alt={image.alt || `صورة ${index + 1}`}
                          className="w-full h-16 object-cover rounded border border-gray-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder.jpg'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-0.5 left-0.5 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                            رئيسية
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {images.length === 0 && (
                    <div className="text-center py-6 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                      <PhotoIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-gray-500 text-xs">لا توجد صور</p>
                    </div>
                  )}
                </div>

                {/* Settings Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                    الإعدادات
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className="mr-2 text-sm text-gray-700">مشروع مميز</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="published"
                        checked={formData.published}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className="mr-2 text-sm text-gray-700">منشور للعامة</span>
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                  <div className="flex flex-col gap-2">
                    <button
                      type="submit"
                      disabled={saving || uploading}
                      className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm font-medium"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          جاري التحديث...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="w-4 h-4 mr-2" />
                          حفظ التغييرات
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push('/admin/projects')}
                      className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
