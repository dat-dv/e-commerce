/*
  Warnings:

  - You are about to drop the column `params` on the `homepage_sections` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `homepage_sections` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "homepage_section_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "homepage_section_id" TEXT NOT NULL,
    "language_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    CONSTRAINT "homepage_section_translations_homepage_section_id_fkey" FOREIGN KEY ("homepage_section_id") REFERENCES "homepage_sections" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "homepage_section_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_homepage_sections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "require_login" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_homepage_sections" ("created_at", "id", "is_enabled", "order", "type", "updated_at") SELECT "created_at", "id", "is_enabled", "order", "type", "updated_at" FROM "homepage_sections";
DROP TABLE "homepage_sections";
ALTER TABLE "new_homepage_sections" RENAME TO "homepage_sections";
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
    "homepage_section_id" TEXT,
    CONSTRAINT "product_categories_homepage_section_id_fkey" FOREIGN KEY ("homepage_section_id") REFERENCES "homepage_sections" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "product_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "product_categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "product_categories_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_product_categories" ("created_at", "id", "image_id", "is_active", "level", "order", "parent_id", "slug", "updated_at") SELECT "created_at", "id", "image_id", "is_active", "level", "order", "parent_id", "slug", "updated_at" FROM "product_categories";
DROP TABLE "product_categories";
ALTER TABLE "new_product_categories" RENAME TO "product_categories";
CREATE UNIQUE INDEX "product_categories_slug_key" ON "product_categories"("slug");
CREATE UNIQUE INDEX "product_categories_image_id_key" ON "product_categories"("image_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "homepage_section_translations_homepage_section_id_language_id_key" ON "homepage_section_translations"("homepage_section_id", "language_id");
