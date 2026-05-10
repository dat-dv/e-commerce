import { PrismaClient, Prisma, User, Tag, Post } from '../../generated/prisma/client';

export async function seedPhase2(prisma: PrismaClient, defaultUser: User, users: User[], tags: Tag[]) {
  console.log('--- Phase 2: Posts ---');

  if (!users.length || !tags.length) {
    console.log('⚠️ Không có User hoặc Tag nào để tạo Post.');
    return [];
  }

  // Hàm tự sinh chuỗi ID ngẫu nhiên giả lập CUID
  const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  // Hàm lấy ngẫu nhiên N phần tử từ mảng Tags
  const getRandomTags = (count: number) => {
    const shuffled = [...tags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  console.log(`🌱 Đang chuẩn bị dữ liệu cho 50 Bài viết (Mỗi bài từ 1 đến 10 tags)...`);

  // 1. Tạo dữ liệu 5 Bài viết riêng cho Default User
  const defaultUserPosts = Array(5)
    .fill(0)
    .map((_, i) => {
      const tagCount = Math.floor(Math.random() * 10) + 1; // Ngẫu nhiên từ 1 đến 10
      const randomTags = getRandomTags(tagCount);

      return {
        id: generateId(),
        title: `Bài viết của tôi số ${i + 1}`,
        content: { text: `Đây là bài viết do tài khoản user@example.com tự viết. Bài số ${i + 1}.` },
        slug: `bai-viet-cua-toi-so-${i + 1}-${Math.random().toString(36).substring(7)}`,
        user_id: defaultUser.id,
        _tag_ids: randomTags.map((t) => t.id), // Lưu mảng ID tạm để lát tạo PostTag
      };
    });

  // 2. Tạo dữ liệu 45 Bài viết cho các User khác
  const otherPosts = Array(45)
    .fill(0)
    .map((_, i) => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const tagCount = Math.floor(Math.random() * 10) + 1; // Ngẫu nhiên từ 1 đến 10
      const randomTags = getRandomTags(tagCount);

      return {
        id: generateId(),
        title: `Bài viết mẫu số ${i + 1}`,
        content: { text: `Đây là nội dung của bài viết mẫu số ${i + 1}.` },
        slug: `bai-viet-mau-so-${i + 1}-${Math.random().toString(36).substring(7)}`,
        user_id: randomUser.id,
        _tag_ids: randomTags.map((t) => t.id),
      };
    });

  const allPostsData = [...defaultUserPosts, ...otherPosts];

  // Loại bỏ trường tạm _tag_ids trước khi đẩy vào Prisma
  const postsToInsert: Prisma.PostCreateManyInput[] = allPostsData.map(({ _tag_ids, ...rest }) => rest);

  console.log(`💾 Đang lưu 50 Bài viết vào DB...`);
  await prisma.post.createMany({
    data: postsToInsert,
  });

  // 3. Tạo dữ liệu PostTag
  console.log(`🏷️ Đang gắn Tag cho các Bài viết (Hàng loạt bằng flatMap)...`);
  const postTagsData: Prisma.PostTagCreateManyInput[] = allPostsData.flatMap((post) =>
    post._tag_ids.map((tagId) => ({
      post_id: post.id,
      tag_id: tagId,
    })),
  );

  await prisma.postTag.createMany({
    data: postTagsData,
  });

  console.log(`📝 Đã tạo thành công 50 Bài viết kèm Tags.`);

  return postsToInsert;
}
