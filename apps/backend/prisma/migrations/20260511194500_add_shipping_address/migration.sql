-- AlterTable
ALTER TABLE "User" ADD COLUMN "gender" INTEGER;

-- CreateTable
CREATE TABLE "ShippingAddress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "receiver_name" TEXT NOT NULL,
    "receiver_phone" TEXT NOT NULL,
    "label" INTEGER NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "ShippingAddress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);
