-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "seller_id" TEXT,
    "brand_id" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "sold_count" INTEGER NOT NULL DEFAULT 0,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "rating" REAL NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "base_price" REAL NOT NULL DEFAULT 0,
    "thumbnail_id" TEXT,
    CONSTRAINT "products_thumbnail_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "images" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_products" ("brand_id", "created_at", "deleted_at", "id", "rating", "seller_id", "slug", "sold_count", "status", "thumbnail_id", "updated_at") SELECT "brand_id", "created_at", "deleted_at", "id", "rating", "seller_id", "slug", "sold_count", "status", "thumbnail_id", "updated_at" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");
CREATE UNIQUE INDEX "products_thumbnail_id_key" ON "products"("thumbnail_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
