-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "logo_url" TEXT,
    "website_url" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "brand_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brand_id" TEXT NOT NULL,
    "language_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "brand_translations_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "brand_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seller_id" TEXT,
    "brand_id" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "thumbnail_id" TEXT,
    CONSTRAINT "products_thumbnail_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_products" ("brand_id", "created_at", "deleted_at", "id", "seller_id", "status", "thumbnail_id", "updated_at") SELECT "brand_id", "created_at", "deleted_at", "id", "seller_id", "status", "thumbnail_id", "updated_at" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
CREATE UNIQUE INDEX "products_thumbnail_id_key" ON "products"("thumbnail_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "brand_translations_brand_id_language_id_key" ON "brand_translations"("brand_id", "language_id");
