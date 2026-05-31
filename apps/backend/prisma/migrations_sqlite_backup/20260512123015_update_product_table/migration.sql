/*
  Warnings:

  - You are about to drop the `FlashSale` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FlashSaleProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sku` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `description` on the `product_categories` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `product_categories` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "FlashSaleProduct_flash_sale_id_sku_id_key";

-- DropIndex
DROP INDEX "Product_thumbnail_id_key";

-- DropIndex
DROP INDEX "Sku_sku_code_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FlashSale";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FlashSaleProduct";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Product";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Sku";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "flash_sales" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "flash_sale_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "flash_sale_id" TEXT NOT NULL,
    "sku_id" TEXT NOT NULL,
    "sale_price" REAL NOT NULL,
    "stock" INTEGER NOT NULL,
    "sold_count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "flash_sale_products_flash_sale_id_fkey" FOREIGN KEY ("flash_sale_id") REFERENCES "flash_sales" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "flash_sale_products_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "skus" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_category_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category_id" TEXT NOT NULL,
    "language_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "product_category_translations_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "product_category_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seller_id" TEXT,
    "brand_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "thumbnail_id" TEXT,
    CONSTRAINT "products_thumbnail_id_fkey" FOREIGN KEY ("thumbnail_id") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "skus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_id" TEXT NOT NULL,
    "sku_code" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "image_url" TEXT,
    CONSTRAINT "skus_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CartItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cart_id" TEXT NOT NULL,
    "sku_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "CartItem_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CartItem_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "skus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CartItem" ("cart_id", "id", "quantity", "sku_id") SELECT "cart_id", "id", "quantity", "sku_id" FROM "CartItem";
DROP TABLE "CartItem";
ALTER TABLE "new_CartItem" RENAME TO "CartItem";
CREATE UNIQUE INDEX "CartItem_cart_id_sku_id_key" ON "CartItem"("cart_id", "sku_id");
CREATE TABLE "new_OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "sku_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "skus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderItem" ("id", "order_id", "price", "quantity", "sku_id") SELECT "id", "order_id", "price", "quantity", "sku_id" FROM "OrderItem";
DROP TABLE "OrderItem";
ALTER TABLE "new_OrderItem" RENAME TO "OrderItem";
CREATE TABLE "new_ProductTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_id" TEXT NOT NULL,
    "language_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "ProductTranslation_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductTranslation_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductTranslation" ("description", "id", "language_id", "name", "product_id") SELECT "description", "id", "language_id", "name", "product_id" FROM "ProductTranslation";
DROP TABLE "ProductTranslation";
ALTER TABLE "new_ProductTranslation" RENAME TO "ProductTranslation";
CREATE UNIQUE INDEX "ProductTranslation_product_id_language_id_key" ON "ProductTranslation"("product_id", "language_id");
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_id" TEXT NOT NULL,
    "sku_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "images" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "skus" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("comment", "created_at", "id", "images", "product_id", "rating", "sku_id", "user_id") SELECT "comment", "created_at", "id", "images", "product_id", "rating", "sku_id", "user_id" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE TABLE "new_SkuAttributeValue" (
    "sku_id" TEXT NOT NULL,
    "attribute_value_id" TEXT NOT NULL,

    PRIMARY KEY ("sku_id", "attribute_value_id"),
    CONSTRAINT "SkuAttributeValue_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "skus" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SkuAttributeValue_attribute_value_id_fkey" FOREIGN KEY ("attribute_value_id") REFERENCES "AttributeValue" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SkuAttributeValue" ("attribute_value_id", "sku_id") SELECT "attribute_value_id", "sku_id" FROM "SkuAttributeValue";
DROP TABLE "SkuAttributeValue";
ALTER TABLE "new_SkuAttributeValue" RENAME TO "SkuAttributeValue";
CREATE TABLE "new_UserBrowsingHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "viewed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserBrowsingHistory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserBrowsingHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserBrowsingHistory" ("id", "product_id", "user_id", "viewed_at") SELECT "id", "product_id", "user_id", "viewed_at" FROM "UserBrowsingHistory";
DROP TABLE "UserBrowsingHistory";
ALTER TABLE "new_UserBrowsingHistory" RENAME TO "UserBrowsingHistory";
CREATE INDEX "UserBrowsingHistory_user_id_viewed_at_idx" ON "UserBrowsingHistory"("user_id", "viewed_at");
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
    CONSTRAINT "product_categories_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_product_categories" ("created_at", "id", "image_id", "parent_id", "slug", "updated_at") SELECT "created_at", "id", "image_id", "parent_id", "slug", "updated_at" FROM "product_categories";
DROP TABLE "product_categories";
ALTER TABLE "new_product_categories" RENAME TO "product_categories";
CREATE UNIQUE INDEX "product_categories_slug_key" ON "product_categories"("slug");
CREATE UNIQUE INDEX "product_categories_image_id_key" ON "product_categories"("image_id");
CREATE TABLE "new_product_category_mappings" (
    "product_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    PRIMARY KEY ("product_id", "category_id"),
    CONSTRAINT "product_category_mappings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "product_category_mappings_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_product_category_mappings" ("category_id", "product_id") SELECT "category_id", "product_id" FROM "product_category_mappings";
DROP TABLE "product_category_mappings";
ALTER TABLE "new_product_category_mappings" RENAME TO "product_category_mappings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "flash_sale_products_flash_sale_id_sku_id_key" ON "flash_sale_products"("flash_sale_id", "sku_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_category_translations_category_id_language_id_key" ON "product_category_translations"("category_id", "language_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_thumbnail_id_key" ON "products"("thumbnail_id");

-- CreateIndex
CREATE UNIQUE INDEX "skus_sku_code_key" ON "skus"("sku_code");
