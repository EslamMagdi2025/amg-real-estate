'use client'

import { useState } from 'react'

export default function TestEmailPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleTest = async () => {
    if (!email) {
      alert('أدخل الإيميل أولاً')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: email,
          subject: '🧪 اختبار إعدادات Gmail - AMG Real Estate',
          text: 'هذا اختبار لإعدادات Gmail. إذا وصلتك هذه الرسالة، فالإعدادات تعمل بشكل صحيح!'
        })
      })

      const data = await response.json()
      setResult(data)

    } catch (error: any) {
      setResult({
        success: false,
        message: 'خطأ في الاتصال',
        error: error?.message || 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-900">
          🧪 اختبار إعدادات الإيميل
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني للاختبار
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleTest}
            disabled={loading || !email}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '⏳ جاري الإرسال...' : '📧 إرسال إيميل تجريبي'}
          </button>

          {result && (
            <div className={`p-4 rounded-lg ${
              result.success 
                ? 'bg-green-100 border border-green-300' 
                : 'bg-red-100 border border-red-300'
            }`}>
              <h3 className={`font-bold ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success ? '✅ نجح الإرسال!' : '❌ فشل الإرسال'}
              </h3>
              <p className={`mt-2 ${
                result.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.message}
              </p>
              {result.messageId && (
                <p className="text-green-600 text-sm mt-1">
                  Message ID: {result.messageId}
                </p>
              )}
              {result.error && (
                <p className="text-red-600 text-sm mt-1">
                  خطأ: {result.error}
                </p>
              )}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-2">📋 خطوات مهمة:</h4>
            <ol className="text-blue-800 text-sm space-y-1">
              <li>1. تأكد من إنشاء Gmail App Password</li>
              <li>2. تحديث SMTP_PASS في .env.local</li>
              <li>3. إعادة تشغيل الخادم</li>
              <li>4. اختبار الإرسال</li>
            </ol>
          </div>

          <div className="text-center">
            <a 
              href="/dashboard" 
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ← العودة للوحة التحكم
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}