'use client';

import { useState } from 'react';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

interface FreeMapProps {
  lat?: number;
  lng?: number;
  address?: string;
  className?: string;
}

export default function FreeMap({ 
  lat = 30.0444, 
  lng = 31.2357, 
  address = "القاهرة الجديدة، مصر",
  className = "" 
}: FreeMapProps) {
  const [selectedLocation, setSelectedLocation] = useState(0);

  // مواقع الفروع
  const locations = [
    {
      lat: 31.2568,
      lng: 32.2910,
      name: "فرع بورسعيد",
      address: "بورسعيد، مصر",
      phone: "+20 66 123 4567",
      email: "portsaid@amg-realestate.com",
      hours: "السبت - الخميس: 9:00 ص - 6:00 م",
      color: "blue",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.5985!2d32.291!3d31.2568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f9a8b8dfe70859%3A0x0!2zMzHCsDE1JzI0LjUiTiAzMsKwMTcnMjcuNiJF!5e0!3m2!1sar!2seg!4v1234567890"
    },
    {
      lat: 30.0444,
      lng: 31.2357,
      name: "فرع التجمع الخامس", 
      address: "قريب من مول 7K، التجمع الخامس، القاهرة الجديدة",
      phone: "+20 2 123 4567",
      email: "newcairo@amg-realestate.com",
      hours: "السبت - الخميس: 9:00 ص - 7:00 م",
      color: "red",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.123!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145822e8c6a7a123%3A0x0!2zMzDCsDAyJzM5LjgiTiAzMcKwMTQnMDguNSJF!5e0!3m2!1sar!2seg!4v1234567890"
    }
  ];

  const currentLocation = locations[selectedLocation];

  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg bg-white ${className}`}>
      {/* Header with location selector */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <MapPinIcon className="w-6 h-6 text-red-500 ml-2" />
          مواقع فروعنا
        </h3>
        <div className="flex gap-2">
          {locations.map((location, index) => (
            <button
              key={index}
              onClick={() => setSelectedLocation(index)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedLocation === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {location.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map Section */}
      <div className="relative">
        <iframe
          src={currentLocation.mapUrl}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full"
        ></iframe>
      </div>

      {/* Location Details */}
      <div className="p-6 bg-gray-50">
        <h4 className="text-lg font-bold text-gray-900 mb-4">{currentLocation.name}</h4>
        <div className="space-y-3">
          <div className="flex items-start">
            <MapPinIcon className="w-5 h-5 text-gray-500 mt-0.5 ml-3" />
            <span className="text-gray-700">{currentLocation.address}</span>
          </div>
          <div className="flex items-center">
            <PhoneIcon className="w-5 h-5 text-gray-500 ml-3" />
            <a 
              href={`tel:${currentLocation.phone}`}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {currentLocation.phone}
            </a>
          </div>
          <div className="flex items-center">
            <EnvelopeIcon className="w-5 h-5 text-gray-500 ml-3" />
            <a 
              href={`mailto:${currentLocation.email}`}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {currentLocation.email}
            </a>
          </div>
          <div className="flex items-center">
            <ClockIcon className="w-5 h-5 text-gray-500 ml-3" />
            <span className="text-gray-700">{currentLocation.hours}</span>
          </div>
        </div>
      </div>
    </div>
  );
}