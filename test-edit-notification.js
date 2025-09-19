// اختبار نظام إرسال إشعارات طلب التعديل
const testPropertyEditNotification = async () => {
  try {
    console.log('🧪 Testing property edit notification system...')

    // محاكاة طلب تعديل عقار من الأدمن
    const response = await fetch('http://localhost:3000/api/admin/properties/review', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer admin-session-test'
      },
      body: JSON.stringify({
        propertyId: 'test-property-123',
        action: 'needs_edit',
        rejectionReason: 'يرجى إضافة صور أوضح وتحديث الوصف'
      })
    })

    const result = await response.json()
    console.log('📝 Admin review result:', result)

    // اختبار جلب الإشعارات
    const notificationsResponse = await fetch('http://localhost:3000/api/notifications?limit=5', {
      headers: {
        'Authorization': 'Bearer test-user-token'
      }
    })

    const notifications = await notificationsResponse.json()
    console.log('📢 Notifications result:', notifications)

    console.log('✅ Test completed!')

  } catch (error) {
    console.error('❌ Test error:', error)
  }
}

// تشغيل الاختبار
testPropertyEditNotification()