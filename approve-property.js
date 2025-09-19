const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function approveProperty() {
  try {
    console.log('📝 اعتماد العقار الموجود...')
    
    // العثور على العقار المعلق
    const property = await prisma.property.findFirst({
      where: {
        reviewStatus: 'PENDING'
      }
    })
    
    if (!property) {
      console.log('❌ لم يتم العثور على عقارات معلقة')
      return
    }
    
    console.log(`✨ العقار المعثور عليه: ${property.title}`)
    
    // اعتماد العقار
    const updatedProperty = await prisma.property.update({
      where: {
        id: property.id
      },
      data: {
        reviewStatus: 'APPROVED',
        status: 'ACTIVE',
        reviewedAt: new Date()
      }
    })
    
    console.log('✅ تم اعتماد العقار بنجاح!')
    console.log(`📍 العقار: ${updatedProperty.title}`)
    console.log(`📊 Status: ${updatedProperty.status}`)
    console.log(`🔍 Review Status: ${updatedProperty.reviewStatus}`)
    
    // فحص العقارات المعتمدة والنشطة بعد التحديث
    const activeApproved = await prisma.property.findMany({
      where: {
        status: 'ACTIVE',
        reviewStatus: 'APPROVED'
      }
    })
    
    console.log(`🎉 العقارات النشطة والمعتمدة الآن: ${activeApproved.length}`)
    
  } catch (error) {
    console.error('❌ خطأ في اعتماد العقار:', error)
  } finally {
    await prisma.$disconnect()
  }
}

approveProperty()