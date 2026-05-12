-- CreateTable
CREATE TABLE "flash_sale_time_slots" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "start_hour" INTEGER NOT NULL,
    "start_minute" INTEGER NOT NULL DEFAULT 0,
    "end_hour" INTEGER NOT NULL,
    "end_minute" INTEGER NOT NULL DEFAULT 59,
    "is_active" BOOLEAN NOT NULL DEFAULT true
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_flash_sale_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "flash_sale_id" TEXT NOT NULL,
    "sku_id" TEXT NOT NULL,
    "sale_price" REAL NOT NULL,
    "stock" INTEGER NOT NULL,
    "sold_count" INTEGER NOT NULL DEFAULT 0,
    "order_limit" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "flash_sale_products_flash_sale_id_fkey" FOREIGN KEY ("flash_sale_id") REFERENCES "flash_sales" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "flash_sale_products_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "skus" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_flash_sale_products" ("flash_sale_id", "id", "sale_price", "sku_id", "sold_count", "stock") SELECT "flash_sale_id", "id", "sale_price", "sku_id", "sold_count", "stock" FROM "flash_sale_products";
DROP TABLE "flash_sale_products";
ALTER TABLE "new_flash_sale_products" RENAME TO "flash_sale_products";
CREATE UNIQUE INDEX "flash_sale_products_flash_sale_id_sku_id_key" ON "flash_sale_products"("flash_sale_id", "sku_id");
CREATE TABLE "new_flash_sales" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "time_slot_id" TEXT,
    CONSTRAINT "flash_sales_time_slot_id_fkey" FOREIGN KEY ("time_slot_id") REFERENCES "flash_sale_time_slots" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_flash_sales" ("created_at", "end_time", "id", "name", "start_time", "updated_at") SELECT "created_at", "end_time", "id", "name", "start_time", "updated_at" FROM "flash_sales";
DROP TABLE "flash_sales";
ALTER TABLE "new_flash_sales" RENAME TO "flash_sales";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
