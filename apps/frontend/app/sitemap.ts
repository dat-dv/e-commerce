import { MetadataRoute } from 'next';

import { PUBLIC_ENV } from '@/config/public.env.config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = PUBLIC_ENV.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const routes = ['', '/sign-in', '/sign-up', '/profile', '/terms'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1 : 0.8,
    }),
  );

  return routes;
}
