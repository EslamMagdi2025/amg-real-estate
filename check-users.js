const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        verified: true,
        emailVerified: true,
        active: true,
        createdAt: true
      }
    })

    console.log(`Found ${users.length} users:`)
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Active: ${user.active}`)
      console.log(`   Verified: ${user.verified}`)
      console.log(`   Email Verified: ${user.emailVerified}`)
      console.log(`   Created: ${user.createdAt}`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error checking users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()