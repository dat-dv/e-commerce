import { PrismaClient, User, Tag } from '../../generated/prisma/client';

export async function seedPhase2(prisma: PrismaClient, defaultUser: User, users: User[], tags: Tag[]) {
  console.log('--- Phase 2: Posts ---');

  if (!users.length || !tags.length) {
    console.log('⚠️ Không có User hoặc Tag nào để tạo Post.');
    return [];
  }

  // Hàm tự sinh chuỗi ID ngẫu nhiên giả lập CUID
  const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  console.log(`🌱 Đang chuẩn bị dữ liệu cho 50 Bài viết...`);

  // 1. Tạo dữ liệu 5 Bài viết riêng cho Default User
  const defaultUserPosts = Array(5)
    .fill(0)
    .map((_, i) => {
      const randomTag = tags[Math.floor(Math.random() * tags.length)];
      return {
        post_id: generateId(),
        title: `Bài viết của tôi số ${i + 1} về ${randomTag.tag_name}`,
        content: { text: `Đây là bài viết do tài khoản user@example.com tự viết. Bài số ${i + 1}.` },
        slug: `bai-viet-cua-toi-so-${i + 1}-${Math.random().toString(36).substring(7)}`,
        user_id: defaultUser.user_id,
        _tag_id: randomTag.id, // Lưu tạm để lát tạo PostTag
      };
    });

  // 2. Tạo dữ liệu 45 Bài viết cho các User khác
  const otherPosts = Array(45)
    .fill(0)
    .map((_, i) => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomTag = tags[Math.floor(Math.random() * tags.length)];
      return {
        post_id: generateId(),
        title: `Bài viết mẫu số ${i + 1}`,
        content: { text: `Đây là nội dung của bài viết mẫu số ${i + 1}.` },
        slug: `bai-viet-mau-so-${i + 1}-${Math.random().toString(36).substring(7)}`,
        user_id: randomUser.user_id,
        _tag_id: randomTag.id,
      };
    });

  const allPostsData = [...defaultUserPosts, ...otherPosts];

  // Loại bỏ trường tạm _tag_id trước khi đẩy vào Prisma
  const postsToInsert = allPostsData.map(({ _tag_id, ...rest }) => rest);

  console.log(`💾 Đang lưu 50 Bài viết vào DB bằng createMany...`);
  await prisma.post.createMany({
    data: postsToInsert,
  });

  // 3. Tạo dữ liệu PostTag
  console.log(`🏷️ Đang gắn Tag cho các Bài viết...`);
  const postTagsData = allPostsData.map((post) => ({
    post_id: post.post_id,
    tag_id: post._tag_id,
  }));

  await prisma.postTag.createMany({
    data: postTagsData,
  });

  console.log(`📝 Đã tạo thành công 50 Bài viết kèm Tags.`);

  // Trả về danh sách post data để Phase 3 dùng (chỉ cần post_id và user_id là đủ)
  return postsToInsert;
}
