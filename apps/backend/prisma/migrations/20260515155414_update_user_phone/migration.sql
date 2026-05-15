/*
  Warnings:

  - You are about to drop the column `phone` on the `user_phones` table. All the data in the column will be lost.
  - Added the required column `phone_number` to the `user_phones` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_phones" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone_number" TEXT NOT NULL,
    "phone_code" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "user_phones_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_user_phones" ("created_at", "id", "is_default", "is_verified", "phone_code", "updated_at", "user_id") SELECT "created_at", "id", "is_default", "is_verified", "phone_code", "updated_at", "user_id" FROM "user_phones";
DROP TABLE "user_phones";
ALTER TABLE "new_user_phones" RENAME TO "user_phones";
CREATE UNIQUE INDEX "user_phones_phone_number_key" ON "user_phones"("phone_number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
