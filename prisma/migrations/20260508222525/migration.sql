/*
  Warnings:

  - You are about to drop the `PermissionCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `category_id` on the `Permission` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PermissionCategory_category_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PermissionCategory";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Permission" (
    "permission_id" TEXT NOT NULL PRIMARY KEY,
    "permission_name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Permission" ("created_at", "description", "permission_id", "permission_name", "updated_at") SELECT "created_at", "description", "permission_id", "permission_name", "updated_at" FROM "Permission";
DROP TABLE "Permission";
ALTER TABLE "new_Permission" RENAME TO "Permission";
CREATE UNIQUE INDEX "Permission_permission_name_key" ON "Permission"("permission_name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
