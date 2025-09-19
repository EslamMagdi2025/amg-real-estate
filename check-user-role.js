const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserRole() {
  try {
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: ['eslam480@outlook.com', 'islam@example.com']
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    console.log('Users found:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });

  } catch (error) {
    console.error('Error checking user roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserRole();