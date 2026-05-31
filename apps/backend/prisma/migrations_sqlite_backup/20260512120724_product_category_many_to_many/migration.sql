/*
  Warnings:

  - You are about to drop the column `category_id` on the `Product` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "product_category_mappings" (
    "product_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    PRIMARY KEY ("product_id", "category_id"),
    CONSTRAINT "product_category_mappings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "product_category_mappings_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seller_id" TEXT,
    "brand_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "thumbnail_id" TEXT,
    CONSTRAINT "Product_thumbnail_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("brand_id", "created_at", "deleted_at", "id", "seller_id", "status", "thumbnail_id", "updated_at") SELECT "brand_id", "created_at", "deleted_at", "id", "seller_id", "status", "thumbnail_id", "updated_at" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_thumbnail_id_key" ON "Product"("thumbnail_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
