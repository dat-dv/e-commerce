export interface TComment {
  id: string;
  content: string;
  postId: string;
  userId: string;
  parentId?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date | null;
}
