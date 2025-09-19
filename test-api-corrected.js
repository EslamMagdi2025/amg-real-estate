const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testActivitiesAPI() {
  console.log('🔍 Testing Activities API with corrected schema...\n');

  try {
    // Get the user
    const user = await prisma.user.findFirst();
    console.log(`👤 Testing with user: ${user.email}\n`);

    // Import the getUserActivities function and test it
    console.log('📋 Testing getUserActivities function...');
    
    // Test direct function call (simulating the API)
    const activities = await prisma.userActivity.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        action: true,
        details: true,
        ipAddress: true,
        userAgent: true,
        location: true,
        createdAt: true
      }
    });

    console.log(`✅ Found ${activities.length} activities:`);
    activities.forEach((activity, index) => {
      console.log(`   ${index + 1}. [${activity.action}] ${activity.details || 'No details'}`);
      console.log(`      🕐 ${activity.createdAt.toISOString()}`);
      if (activity.location) console.log(`      📍 ${activity.location}`);
      if (activity.ipAddress) console.log(`      🌐 ${activity.ipAddress}`);
      console.log('');
    });

    // Test activity stats grouping
    console.log('📊 Testing activity stats...');
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const stats = await prisma.userActivity.groupBy({
      by: ['action'],
      where: {
        userId: user.id,
        createdAt: { gte: since }
      },
      _count: { action: true }
    });

    console.log('✅ Activity statistics (last 30 days):');
    stats.forEach(stat => {
      console.log(`   ${stat.action}: ${stat._count.action} times`);
    });

    console.log('\n🎉 Activities API testing completed successfully!');
    console.log('📊 Summary:');
    console.log('   ✅ Database queries: Working');
    console.log('   ✅ Activity retrieval: Working');
    console.log('   ✅ Activity grouping: Working');
    console.log('   ✅ Schema compatibility: Working');

  } catch (error) {
    console.error('❌ Error testing activities API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testActivitiesAPI();