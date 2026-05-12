import { PrismaClient } from '../../generated/prisma/client';

async function setupLanguage(prisma: PrismaClient) {
  // 1. Tạo Languages
  const vi = await prisma.language.upsert({
    where: { code: 'vi' },
    update: {},
    create: { code: 'vi', name: 'Vietnamese' },
  });

  const en = await prisma.language.upsert({
    where: { code: 'en' },
    update: {},
    create: { code: 'en', name: 'English' },
  });

  return { vi, en };
}

export { setupLanguage };
