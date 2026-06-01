const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function test() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@texasia.local' } });
  console.log('User found:', user ? user.email : 'No user');
  if (user) {
    const match = await bcrypt.compare('ChangeMe123!', user.password);
    console.log('Password match:', match);
  }
}
test().catch(console.error).finally(() => prisma.$disconnect());
