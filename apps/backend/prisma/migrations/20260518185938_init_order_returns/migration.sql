/*
  Warnings:

  - You are about to drop the `order_support_request_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_support_requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "order_support_request_images_request_id_image_id_key";

-- DropIndex
DROP INDEX "order_support_request_images_image_id_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "order_support_request_images";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "order_support_requests";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "order_returns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" INTEGER NOT NULL DEFAULT 320,
    "created_by_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "order_returns_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_returns_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "order_return_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_return_id" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_return_images_order_return_id_fkey" FOREIGN KEY ("order_return_id") REFERENCES "order_returns" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_return_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 300,
    "total_amount" REAL NOT NULL,
    "discount_amount" REAL NOT NULL DEFAULT 0,
    "shipping_address_id" TEXT,
    "coupon_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "orders_shipping_address_id_fkey" FOREIGN KEY ("shipping_address_id") REFERENCES "shipping_addresses" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "orders_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);
INSERT INTO "new_orders" ("coupon_id", "created_at", "discount_amount", "id", "shipping_address_id", "status", "total_amount", "updated_at", "user_id")
SELECT
    "coupon_id",
    "created_at",
    "discount_amount",
    "id",
    "shipping_address_id",
    CASE "status"
        WHEN 'PENDING' THEN 300
        WHEN 'PAID' THEN 301
        WHEN 'SHIPPING' THEN 302
        WHEN 'DELIVERED' THEN 303
        WHEN 'CANCEL_REQUESTED' THEN 304
        WHEN 'CANCEL_PROCESSING' THEN 305
        WHEN 'CANCELLED' THEN 306
        WHEN 'RETURN_REQUESTED' THEN 307
        WHEN 'RETURN_PROCESSING' THEN 308
        WHEN 'RETURNED' THEN 309
        WHEN 'RETURN_REJECTED' THEN 310
        ELSE CAST("status" AS INTEGER)
    END,
    "total_amount",
    "updated_at",
    "user_id"
FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "order_returns_order_id_key" ON "order_returns"("order_id");

-- CreateIndex
CREATE INDEX "order_return_images_image_id_idx" ON "order_return_images"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_return_images_order_return_id_image_id_key" ON "order_return_images"("order_return_id", "image_id");
