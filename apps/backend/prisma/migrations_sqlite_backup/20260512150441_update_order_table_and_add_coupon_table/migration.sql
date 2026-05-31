-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "discount_type" INTEGER NOT NULL,
    "discount_value" REAL NOT NULL,
    "min_order_amount" REAL NOT NULL DEFAULT 0,
    "max_discount_amount" REAL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "usage_limit" INTEGER NOT NULL DEFAULT 1,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "total_amount" REAL NOT NULL,
    "discount_amount" REAL NOT NULL DEFAULT 0,
    "shipping_address_id" TEXT,
    "coupon_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Order_shipping_address_id_fkey" FOREIGN KEY ("shipping_address_id") REFERENCES "ShippingAddress" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "Order_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "Coupon" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);
INSERT INTO "new_Order" ("created_at", "id", "shipping_address_id", "status", "total_amount", "updated_at", "user_id") SELECT "created_at", "id", "shipping_address_id", "status", "total_amount", "updated_at", "user_id" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
