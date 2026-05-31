/*
  Warnings:

  - You are about to alter the column `status` on the `products` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
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
    CONSTRAINT "products_thumbnail_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_products" ("brand_id", "created_at", "deleted_at", "id", "seller_id", "status", "thumbnail_id", "updated_at") SELECT "brand_id", "created_at", "deleted_at", "id", "seller_id", "status", "thumbnail_id", "updated_at" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
CREATE UNIQUE INDEX "products_thumbnail_id_key" ON "products"("thumbnail_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
