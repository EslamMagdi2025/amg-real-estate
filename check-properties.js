const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkProperties() {
  try {
    console.log('🔍 فحص جميع العقارات في قاعدة البيانات...')
    
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        reviewStatus: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`📊 العدد الإجمالي للعقارات: ${properties.length}`)
    
    properties.forEach(property => {
      console.log(`
📍 العقار: ${property.title}
   ID: ${property.id}
   Status: ${property.status}
   Review Status: ${property.reviewStatus}
   تاريخ الإنشاء: ${property.createdAt.toLocaleString()}
`)
    })
    
    // فحص العقارات المعتمدة والنشطة
    const activeApproved = await prisma.property.findMany({
      where: {
        status: 'ACTIVE',
        reviewStatus: 'APPROVED'
      }
    })
    
    console.log(`✅ العقارات النشطة والمعتمدة: ${activeApproved.length}`)
    
    // فحص العقارات المعتمدة ولكن غير نشطة
    const approvedNotActive = await prisma.property.findMany({
      where: {
        reviewStatus: 'APPROVED',
        NOT: {
          status: 'ACTIVE'
        }
      }
    })
    
    console.log(`⚠️ العقارات المعتمدة لكن غير نشطة: ${approvedNotActive.length}`)
    
  } catch (error) {
    console.error('❌ خطأ في فحص العقارات:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProperties()