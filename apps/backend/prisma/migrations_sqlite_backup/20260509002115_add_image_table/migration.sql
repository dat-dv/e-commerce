/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `Post` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "format" TEXT,
    "bytes" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "post_id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "thumbnail_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "Post_thumbnail_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE CASCADE ON UPDATE NO ACTION
);
INSERT INTO "new_Post" ("content", "created_at", "deleted_at", "post_id", "slug", "status", "title", "updated_at", "user_id") SELECT "content", "created_at", "deleted_at", "post_id", "slug", "status", "title", "updated_at", "user_id" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
CREATE UNIQUE INDEX "Post_thumbnail_id_key" ON "Post"("thumbnail_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
