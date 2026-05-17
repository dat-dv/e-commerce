/*
  Warnings:

  - You are about to drop the `homepage_section_translations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `homepage_sections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `homepage_section_id` on the `product_categories` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "homepage_section_translations_homepage_section_id_language_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "homepage_section_translations";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "homepage_sections";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "featured_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "featured_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_product_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "image_id" TEXT,
    "parent_id" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "product_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "product_categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "product_categories_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_product_categories" ("created_at", "id", "image_id", "is_active", "level", "order", "parent_id", "slug", "updated_at") SELECT "created_at", "id", "image_id", "is_active", "level", "order", "parent_id", "slug", "updated_at" FROM "product_categories";
DROP TABLE "product_categories";
ALTER TABLE "new_product_categories" RENAME TO "product_categories";
CREATE UNIQUE INDEX "product_categories_slug_key" ON "product_categories"("slug");
CREATE UNIQUE INDEX "product_categories_image_id_key" ON "product_categories"("image_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "featured_categories_category_id_key" ON "featured_categories"("category_id");
