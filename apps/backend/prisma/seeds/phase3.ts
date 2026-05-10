import { PrismaClient } from '../../generated/prisma/client';
import { IUser } from '../../src/api/users/domain/entities/user.entity';
import { IPost } from '../../src/api/posts/domain/entities/post.entity';
import { IComment } from '../../src/api/comments/domain/entities/comment.entity';

export async function seedPhase3(
  prisma: PrismaClient,
  posts: Pick<IPost, 'id' | 'user_id'>[],
  defaultUser: IUser,
  users: IUser[],
) {
  console.log('--- Phase 3: Comments ---');

  if (!posts.length || !users.length) {
    console.log('⚠️ Không có Post hoặc User nào để tạo Comment.');
    return;
  }

  // Hàm tự sinh chuỗi ID ngẫu nhiên giả lập CUID
  const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  console.log(`🌱 Đang chuẩn bị dữ liệu cho Comments (Dùng Array, không dùng vòng lặp for)...`);

  // 1. Tạo comment dạo của Default User (5 cái)
  const otherPosts = posts.filter((post) => post.user_id !== defaultUser.id).slice(0, 5);
  const defaultUserComments: IComment[] = otherPosts.map((post, i) => ({
    id: generateId(),
    content: `Bài viết này hay quá! Mình là user@example.com đây. (Comment dạo số ${i + 1})`,
    post_id: post.id,
    user_id: defaultUser.id,
    created_at: new Date(),
    updated_at: new Date(),
  }));

  // 2. Tạo comment gốc ngẫu nhiên cho tất cả các bài viết
  const randomRootComments: IComment[] = posts.flatMap((post) => {
    const rootCommentCount = Math.floor(Math.random() * 2) + 1; // 1 đến 2 comment gốc
    return Array(rootCommentCount)
      .fill(0)
      .map((_, i) => {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        return {
          id: generateId(),
          content: `Bình luận gốc số ${i + 1} trên bài viết.`,
          post_id: post.id,
          user_id: randomUser.id,
          created_at: new Date(),
          updated_at: new Date(),
        };
      });
  });

  const allRootComments = [...defaultUserComments, ...randomRootComments];

  // 3. Tạo reply ngẫu nhiên dựa trên danh sách comment gốc vừa tạo
  const allReplies: IComment[] = allRootComments.flatMap((rootComment) => {
    // Tỷ lệ 20% tạo nhiều reply để test Load More
    const hasManyReplies = Math.random() > 0.8;
    const replyCount = hasManyReplies ? 10 : Math.floor(Math.random() * 2);

    return Array(replyCount)
      .fill(0)
      .map((_, j) => {
        const randomReplyUser = users[Math.floor(Math.random() * users.length)];
        return {
          id: generateId(),
          content: `Phản hồi số ${j + 1} cho bình luận gốc.`,
          post_id: rootComment.post_id,
          user_id: randomReplyUser.id,
          parent_id: rootComment.id, // Gắn vào comment gốc
          created_at: new Date(),
          updated_at: new Date(),
        };
      });
  });

  console.log(`💾 Đang lưu ${allRootComments.length} Bình luận gốc bằng createMany...`);
  await prisma.comment.createMany({
    data: allRootComments,
  });

  console.log(`💾 Đang lưu ${allReplies.length} Phản hồi bằng createMany...`);
  await prisma.comment.createMany({
    data: allReplies,
  });

  console.log('🚀 Đã tạo xong toàn bộ comment bằng createMany (Không dùng vòng lặp for)!');
}
