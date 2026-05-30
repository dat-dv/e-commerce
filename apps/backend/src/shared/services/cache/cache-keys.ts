export const CacheKeys = {
  userPermissions: (userId: string) => `user:permissions:${userId}`,

  userTokenWhitelist: (userId: string) => `user:token:whitelist:${userId}`,

  productCategoryTree: (languageCode: string) => `product-categories:tree:${languageCode}`,

  productCategoryTreeBySlug: (languageCode: string, slug: string) =>
    `product-categories:tree:${languageCode}:slug:${slug}`,

  productCategoryTreePattern: () => 'product-categories:tree:*',
};
