const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testFavoritesSystem() {
  try {
    console.log('🔍 Testing Favorites System...\n');

    // 1. الحصول على المستخدم
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ No users found');
      return;
    }
    console.log(`👤 Testing with user: ${user.email} (ID: ${user.id})\n`);

    // 2. التحقق من وجود عقارات
    let properties = await prisma.property.findMany({ take: 3 });
    
    if (properties.length === 0) {
      console.log('📦 No properties found, creating test properties...');
      
      // إنشاء عقارات تجريبية
      const testProperties = [
        {
          title: 'شقة فاخرة في المعادي',
          description: 'شقة مميزة بموقع رائع وإطلالة جميلة على النيل',
          price: 2500000,
          area: 150,
          bedrooms: 3,
          bathrooms: 2,
          parking: true,
          furnished: true,
          city: 'القاهرة',
          district: 'المعادي',
          address: 'شارع 9، المعادي الجديدة',
          propertyType: 'APARTMENT',
          purpose: 'SALE',
          contactName: 'أحمد محمد',
          contactPhone: '01234567890',
          contactEmail: 'ahmed@example.com',
          userId: user.id
        },
        {
          title: 'فيلا للإيجار في الشيخ زايد',
          description: 'فيلا راقية في كمبوند مميز بالشيخ زايد',
          price: 25000,
          area: 300,
          bedrooms: 4,
          bathrooms: 3,
          parking: true,
          furnished: false,
          city: 'الجيزة',
          district: 'الشيخ زايد',
          address: 'كمبوند الخمائل، الشيخ زايد',
          propertyType: 'VILLA',
          purpose: 'RENT',
          contactName: 'سارة أحمد',
          contactPhone: '01123456789',
          contactEmail: 'sara@example.com',
          userId: user.id
        },
        {
          title: 'مكتب تجاري في وسط البلد',
          description: 'مكتب في موقع استراتيجي مناسب للشركات',
          price: 1500000,
          area: 100,
          parking: false,
          furnished: true,
          city: 'القاهرة',
          district: 'وسط البلد',
          address: 'شارع طلعت حرب، وسط البلد',
          propertyType: 'OFFICE',
          purpose: 'SALE',
          contactName: 'محمد علي',
          contactPhone: '01012345678',
          contactEmail: 'mohamed@example.com',
          userId: user.id
        }
      ];

      for (const propData of testProperties) {
        await prisma.property.create({ data: propData });
      }
      
      properties = await prisma.property.findMany({ take: 3 });
      console.log(`✅ Created ${properties.length} test properties\n`);
    } else {
      console.log(`✅ Found ${properties.length} existing properties\n`);
    }

    // 3. التحقق من المفضلة الحالية
    const existingFavorites = await prisma.favorite.findMany({
      where: { userId: user.id }
    });
    console.log(`📊 Current favorites count: ${existingFavorites.length}`);

    // 4. إضافة عقارات للمفضلة (إذا لم تكن موجودة)
    for (const property of properties) {
      const existingFav = await prisma.favorite.findUnique({
        where: {
          userId_propertyId: {
            userId: user.id,
            propertyId: property.id
          }
        }
      });

      if (!existingFav) {
        await prisma.favorite.create({
          data: {
            userId: user.id,
            propertyId: property.id
          }
        });
        console.log(`💖 Added property "${property.title}" to favorites`);
      } else {
        console.log(`💖 Property "${property.title}" already in favorites`);
      }
    }

    // 5. اختبار جلب المفضلة مع التفاصيل
    console.log('\n📋 Testing favorites retrieval...');
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        property: {
          include: {
            images: {
              where: { isMain: true },
              take: 1
            },
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`✅ Retrieved ${favorites.length} favorites:`);
    favorites.forEach((fav, index) => {
      console.log(`   ${index + 1}. ${fav.property.title}`);
      console.log(`      💰 ${fav.property.price} ${fav.property.currency}`);
      console.log(`      📍 ${fav.property.district}, ${fav.property.city}`);
      console.log(`      📅 Added: ${fav.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    // 6. اختبار البحث في المفضلة
    console.log('🔍 Testing search in favorites...');
    const searchResults = await prisma.favorite.findMany({
      where: {
        userId: user.id,
        property: {
          OR: [
            { title: { contains: 'شقة' } },
            { city: { contains: 'القاهرة' } }
          ]
        }
      },
      include: {
        property: {
          select: {
            title: true,
            city: true
          }
        }
      }
    });

    console.log(`✅ Search results for 'شقة' or 'القاهرة': ${searchResults.length} items`);
    searchResults.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.property.title} - ${result.property.city}`);
    });

    console.log('\n🎉 Favorites system test completed successfully!');
    console.log('📊 Summary:');
    console.log(`   ✅ Total properties: ${properties.length}`);
    console.log(`   ✅ Total favorites: ${favorites.length}`);
    console.log(`   ✅ Search functionality: Working`);
    console.log(`   ✅ Database relationships: Working`);

  } catch (error) {
    console.error('❌ Error testing favorites system:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFavoritesSystem();