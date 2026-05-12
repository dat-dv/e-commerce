import { PrismaClient } from '../../generated/prisma/client';
import { ROLE_ADMIN, ROLE_USER } from '../../src/common/constants/roles.constant';

/**
 * Registry to access seeded data without prop drilling.
 * Use these helpers in other seed files to get roles, languages, etc.
 */
export const SeedRegistry = {
  async getAdminRole(prisma: PrismaClient) {
    return prisma.role.findFirstOrThrow({ where: { role_name: ROLE_ADMIN } });
  },

  async getUserRole(prisma: PrismaClient) {
    return prisma.role.findFirstOrThrow({ where: { role_name: ROLE_USER } });
  },

  async getLanguage(prisma: PrismaClient, code: 'vi' | 'en') {
    return prisma.language.findFirstOrThrow({ where: { code } });
  },

  async getPermission(prisma: PrismaClient, name: string) {
    return prisma.permission.findFirstOrThrow({ where: { permission_name: name } });
  },
};
