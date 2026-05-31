-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_product_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image_id" TEXT,
    "parent_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "product_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "product_categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_product_categories" ("created_at", "description", "id", "image_id", "name", "slug", "updated_at") SELECT "created_at", "description", "id", "image_id", "name", "slug", "updated_at" FROM "product_categories";
DROP TABLE "product_categories";
ALTER TABLE "new_product_categories" RENAME TO "product_categories";
CREATE UNIQUE INDEX "product_categories_slug_key" ON "product_categories"("slug");
CREATE UNIQUE INDEX "product_categories_image_id_key" ON "product_categories"("image_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
