import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { seedRBAC } from './rbac';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔐 Sync RBAC permissions...');
  await seedRBAC(prisma);
  console.log('✅ RBAC permissions synced.');
}

main()
  .catch((error) => {
    console.error('❌ Failed to sync RBAC permissions:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
