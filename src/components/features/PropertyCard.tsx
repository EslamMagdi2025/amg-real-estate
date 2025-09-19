'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { MapPinIcon, HomeIcon, CurrencyDollarIcon, PhoneIcon, EyeIcon } from '@heroicons/react/24/outline'
import { Badge, Button } from '@/components/ui'
import { Property } from '@/types'

interface PropertyCardProps {
  property: Property
  showContact?: boolean
}

export default function PropertyCard({ property, showContact = false }: PropertyCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: currency === 'EGP' ? 'EGP' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'pending':
        return 'warning'
      case 'sold':
      case 'rented':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: Property['status']) => {
    switch (status) {
      case 'active':
        return 'متاح'
      case 'pending':
        return 'معلق'
      case 'sold':
        return 'تم البيع'
      case 'rented':
        return 'تم الإيجار'
      default:
        return status
    }
  }

  const getPurposeText = (purpose: Property['purpose']) => {
    return purpose === 'sale' ? 'للبيع' : 'للإيجار'
  }

  const getTypeText = (type: Property['type']) => {
    const types = {
      apartment: 'شقة',
      villa: 'فيلا',
      office: 'مكتب',
      commercial: 'تجاري',
      land: 'أرض'
    }
    return types[type] || type
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {property.images.length > 0 ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <HomeIcon className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <Badge variant={getStatusColor(property.status)}>
            {getStatusText(property.status)}
          </Badge>
        </div>

        {/* Purpose Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant={property.purpose === 'sale' ? 'info' : 'warning'}>
            {getPurposeText(property.purpose)}
          </Badge>
        </div>

        {/* Type Badge */}
        <div className="absolute bottom-4 left-4">
          <Badge variant="default">
            {getTypeText(property.type)}
          </Badge>
        </div>

        {/* Views Badge */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs">
            <EyeIcon className="w-3 h-3" />
            <span>{property.views || 0}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-4">
          <MapPinIcon className="w-4 h-4 ml-1 flex-shrink-0" />
          <span className="text-sm truncate">
            {property.location.district}, {property.location.city}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        {/* Property Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <HomeIcon className="w-5 h-5 text-blue-500 ml-2" />
            <div>
              <p className="text-xs text-gray-500">المساحة</p>
              <p className="font-semibold">{property.area} م²</p>
            </div>
          </div>
          
          {property.bedrooms && (
            <div className="flex items-center">
              <div className="w-5 h-5 ml-2 flex items-center justify-center">
                <span className="text-blue-500 text-sm">🛏️</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">الغرف</p>
                <p className="font-semibold">{property.bedrooms} غرف</p>
              </div>
            </div>
          )}
          
          {property.bathrooms && (
            <div className="flex items-center">
              <div className="w-5 h-5 ml-2 flex items-center justify-center">
                <span className="text-blue-500 text-sm">🚿</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">الحمامات</p>
                <p className="font-semibold">{property.bathrooms}</p>
              </div>
            </div>
          )}

          <div className="flex items-center">
            <CurrencyDollarIcon className="w-5 h-5 text-green-500 ml-2" />
            <div>
              <p className="text-xs text-gray-500">السعر</p>
              <p className="font-semibold text-green-600">
                {formatPrice(property.price, property.currency)}
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        {property.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {property.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  {feature}
                </span>
              ))}
              {property.features.length > 3 && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  +{property.features.length - 3} المزيد
                </span>
              )}
            </div>
          </div>
        )}

        {/* Contact Info */}
        {showContact && (
          <div className="border-t pt-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <PhoneIcon className="w-4 h-4 ml-1" />
              <span>{property.contact.name} - {property.contact.phone}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link href={`/properties/${property.id}`} className="flex-1">
            <Button variant="primary" className="w-full">
              تفاصيل أكثر
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.open(`tel:${property.contact.phone}`)}>
            <PhoneIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
