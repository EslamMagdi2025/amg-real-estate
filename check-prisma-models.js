const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

console.log('🔍 Available Prisma models:');
console.log(Object.keys(prisma).filter(key => !key.startsWith('$')));

// Check specific models
console.log('\n🧪 Testing specific models:');
console.log('prisma.user exists:', typeof prisma.user);
console.log('prisma.userSession exists:', typeof prisma.userSession);
console.log('prisma.UserSession exists:', typeof prisma.UserSession);

prisma.$disconnect();