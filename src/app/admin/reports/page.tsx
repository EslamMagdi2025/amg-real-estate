'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ReportsPage() {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">التقارير والإحصائيات</h1>
          <p className="text-gray-600">عرض التقارير المفصلة والإحصائيات الشاملة</p>
        </div>

        {/* محتوى صفحة التقارير سيتم إضافته لاحقاً */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center text-gray-500">
            <p>سيتم إضافة محتوى التقارير والإحصائيات قريباً</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}