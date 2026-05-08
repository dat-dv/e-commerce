import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import cookieParser from 'cookie-parser';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

describe('RBAC & Ownership (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let adminCookies: string[];
  let user1Cookies: string[];
  let user2Cookies: string[];
  let testPostId: string;
  let testCommentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    app.use(cookieParser());
    app.setGlobalPrefix('api'); // Ensure prefix is the same as main.ts
    await app.init();

    // 1. Login Admin (From seed: user@example.com / string)
    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'string' });

    adminCookies = adminLogin.get('Set-Cookie') || [];

    // 2. Login User 1 (From seed: example-0@gmail.com / password)
    const user1Login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'example-0@gmail.com', password: 'password' });

    user1Cookies = user1Login.get('Set-Cookie') || [];

    // 3. Login User 2 (From seed: example-1@gmail.com / password)
    const user2Login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'example-1@gmail.com', password: 'password' });

    user2Cookies = user2Login.get('Set-Cookie') || [];
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Post Module (Ownership & Permission)', () => {
    it('User 1 should create a post successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/posts')
        .set('Cookie', user1Cookies)
        .send({ title: 'User 1 Post', content: 'Post content' });

      expect(res.status).toBe(201);
      testPostId = (res.body as { data: { post_id: string } }).data.post_id;
      expect(testPostId).toBeDefined();
    });

    it('User 1 should update their own post successfully', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/posts/${testPostId}`)
        .set('Cookie', user1Cookies)
        .send({ title: 'User 1 Post Updated' });

      expect(res.status).toBe(200);
    });

    it('User 2 should fail to update User 1 post (403)', async () => {
      // Directly check to ensure User 2 does not have ANY permission (avoid DB state issues)
      const user2 = await prisma.user.findUnique({ where: { email: 'example-1@gmail.com' } });
      if (!user2) throw new Error('User 2 not found in seed data');

      const userPermissions = await prisma.role.findMany({
        where: { users: { some: { user_id: user2.user_id } } },
        include: { permissions: true },
      });

      const hasAnyPermission = userPermissions.some((rp) =>
        rp.permissions.some((p) => p.permission_name === 'UPDATE:POST:ANY'),
      );
      expect(hasAnyPermission).toBe(false);

      const res = await request(app.getHttpServer())
        .patch(`/api/posts/${testPostId}`)
        .set('Cookie', user2Cookies)
        .send({ title: 'User 2 trying to update' });

      expect(res.status).toBe(403);
    });

    it('Admin should update User 1 post successfully (Bypass via ANY permission)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/posts/${testPostId}`)
        .set('Cookie', adminCookies)
        .send({ title: 'Admin updated this post' });

      expect(res.status).toBe(200);
    });
  });

  describe('Comment Module (Ownership & Permission)', () => {
    it('User 1 should create a comment on post successfully', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/posts/${testPostId}/comments`)
        .set('Cookie', user1Cookies)
        .send({ content: 'User 1 Comment' });

      expect(res.status).toBe(201);
      testCommentId = (res.body as { data: { comment_id: string } }).data.comment_id;
    });

    it('User 2 should fail to update User 1 comment (403)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/posts/${testPostId}/comments/${testCommentId}`)
        .set('Cookie', user2Cookies)
        .send({ content: 'User 2 trying to update comment' });

      expect(res.status).toBe(403);
    });

    it('User 1 should delete their own comment successfully', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/posts/${testPostId}/comments/${testCommentId}`)
        .set('Cookie', user1Cookies);

      expect(res.status).toBe(200);
    });
  });

  describe('Tag Module (Admin Only)', () => {
    it('User 1 should fail to create Tag (403)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/tags')
        .set('Cookie', user1Cookies)
        .send({ tag_name: 'NewTag' });

      expect(res.status).toBe(403);
    });

    it('Admin should create Tag successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/tags')
        .set('Cookie', adminCookies)
        .send({ tag_name: 'AdminTag' });

      expect(res.status).toBe(201);
    });
  });

  describe('Role Module (Admin Only)', () => {
    it('User 1 should fail to list Roles (403)', async () => {
      const res = await request(app.getHttpServer()).get('/api/roles').set('Cookie', user1Cookies);

      expect(res.status).toBe(403);
    });

    it('Admin should list Roles successfully', async () => {
      const res = await request(app.getHttpServer()).get('/api/roles').set('Cookie', adminCookies);

      expect(res.status).toBe(200);
      expect(Array.isArray((res.body as { data: { items: unknown[] } }).data.items)).toBe(true);
    });
  });
});
