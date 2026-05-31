-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN "flash_sale_id" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "total_amount" REAL NOT NULL,
    "shipping_address_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Order_shipping_address_id_fkey" FOREIGN KEY ("shipping_address_id") REFERENCES "ShippingAddress" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);
INSERT INTO "new_Order" ("created_at", "id", "shipping_address_id", "status", "total_amount", "updated_at", "user_id") SELECT "created_at", "id", "shipping_address_id", "status", "total_amount", "updated_at", "user_id" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
