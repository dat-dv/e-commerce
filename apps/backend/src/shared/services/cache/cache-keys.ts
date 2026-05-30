export const CacheKeys = {
  userPermissions: (userId: string) => `user:permissions:${userId}`,

  userTokenWhitelist: (userId: string) => `user:token:whitelist:${userId}`,
};
