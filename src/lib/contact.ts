import { ContactFormData } from './validation'

// دالة مساعدة لإرسال النماذج
export interface FormResponse {
  success: boolean
  message?: string
  error?: string
}

export async function sendContactForm(data: ContactFormData): Promise<FormResponse> {
  try {
    console.log('Sending contact form data:', { ...data, message: data.message.substring(0, 50) + '...' })
    
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    // التحقق من وجود محتوى في الاستجابة
    let result: any = {}
    
    // التحقق من نوع المحتوى
    const contentType = response.headers.get('content-type')
    const responseText = await response.text()
    
    console.log('Response text:', responseText)
    console.log('Content-Type:', contentType)
    
    // محاولة تحليل JSON فقط إذا كان المحتوى موجود ومن النوع الصحيح
    if (responseText && contentType?.includes('application/json')) {
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        console.error('Response text that failed to parse:', responseText)
        
        // في حالة فشل تحليل JSON، نقوم بإنشاء رسالة خطأ مناسبة
        if (!response.ok) {
          throw new Error('حدث خطأ في الخادم، يرجى المحاولة مرة أخرى')
        }
        
        // إذا كانت الاستجابة ناجحة لكن JSON غير صالح، نعتبر العملية ناجحة
        result = { success: true, message: 'تم إرسال رسالتك بنجاح!' }
      }
    } else if (!response.ok) {
      // إذا لم يكن هناك JSON وكانت الاستجابة فاشلة
      throw new Error(responseText || `خطأ HTTP ${response.status}: ${response.statusText}`)
    } else {
      // استجابة ناجحة بدون JSON
      result = { success: true, message: 'تم إرسال رسالتك بنجاح!' }
    }
    
    console.log('Parsed result:', result)
    
    if (!response.ok) {
      throw new Error(result.error || result.message || 'فشل في إرسال الرسالة')
    }

    return {
      success: true,
      message: result.message || 'تم إرسال رسالتك بنجاح!'
    }
  } catch (error) {
    console.error('Form submission error details:', error)
    
    return {
      success: false,
      error: error instanceof Error 
        ? error.message 
        : 'حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى'
    }
  }
}
