import { ENotificationType } from '@ecommerce/shared';
import { Prisma, PrismaClient } from '../../generated/prisma/client';

const templates = [
  {
    title: 'Order confirmed',
    content: 'Your order has been confirmed and is now being prepared.',
    type: ENotificationType.ORDER,
    link: '/orders',
  },
  {
    title: 'Order is on the way',
    content: 'Your package has left the warehouse and is moving through delivery.',
    type: ENotificationType.ORDER,
    link: '/orders',
  },
  {
    title: 'Flash sale is live',
    content: 'A new flash sale just started. Check the latest deals before they run out.',
    type: ENotificationType.PROMO,
    link: '/flash-sale',
  },
  {
    title: 'Coupon unlocked',
    content: 'A limited coupon is available for your next checkout.',
    type: ENotificationType.PROMO,
    link: '/vouchers',
  },
  {
    title: 'Security update',
    content: 'Your account security settings were reviewed successfully.',
    type: ENotificationType.SYSTEM,
    link: '/profile',
  },
  {
    title: 'Profile reminder',
    content: 'Complete your profile so checkout and delivery can be faster.',
    type: ENotificationType.SYSTEM,
    link: '/profile',
  },
  {
    title: 'Review received',
    content: 'Thanks for sharing your product review with the community.',
    type: ENotificationType.SOCIAL,
    link: '/orders',
  },
  {
    title: 'Wishlist update',
    content: 'One of your saved products is getting attention from other shoppers.',
    type: ENotificationType.SOCIAL,
    link: '/favorites',
  },
];

const createMetadata = (index: number, type: ENotificationType) => {
  if (type === ENotificationType.ORDER) {
    return JSON.stringify({
      orderId: `seed-order-${String(index + 1).padStart(3, '0')}`,
    });
  }

  if (type === ENotificationType.PROMO) {
    return JSON.stringify({
      campaignId: `seed-campaign-${String((index % 8) + 1).padStart(2, '0')}`,
    });
  }

  return null;
};

export async function seedNotifications(prisma: PrismaClient) {
  console.log('--- Phase 5: Notifications ---');

  const users = await prisma.user.findMany({
    where: {
      email: {
        in: ['user@example.com', 'datdoan.dev@gmail.com', 'example-0@gmail.com', 'example-1@gmail.com'],
      },
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (users.length === 0) {
    console.warn('⚠️ Không tìm thấy user để seed notifications.');
    return;
  }

  const now = Date.now();
  const notifications: Prisma.NotificationCreateManyInput[] = users.flatMap((user, userIndex) =>
    Array.from({ length: userIndex < 2 ? 48 : 24 }, (_, index) => {
      const template = templates[index % templates.length];
      const createdAt = new Date(now - (index + userIndex * 7) * 60 * 60 * 1000);

      return {
        user_id: user.id,
        title: template.title,
        content: template.content,
        type: template.type,
        link: template.link,
        is_read: index % 4 === 0,
        metadata: createMetadata(index, template.type),
        created_at: createdAt,
        updated_at: createdAt,
      };
    }),
  );

  await prisma.notification.createMany({
    data: notifications,
  });

  console.log(`🔔 Đã tạo ${notifications.length} notifications cho ${users.length} users.`);
}
