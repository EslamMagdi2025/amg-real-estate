'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">إعدادات النظام</h1>
          <p className="text-gray-600">تخصيص وإعداد النظام</p>
        </div>

        {/* محتوى صفحة الإعدادات سيتم إضافته لاحقاً */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center text-gray-500">
            <p>سيتم إضافة محتوى إعدادات النظام قريباً</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}