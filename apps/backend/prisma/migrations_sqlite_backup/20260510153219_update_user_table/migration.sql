-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "role_id" TEXT,
    CONSTRAINT "User_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("avatar_id", "created_at", "deleted_at", "email", "first_name", "id", "last_name", "password", "role_id", "updated_at") SELECT "avatar_id", "created_at", "deleted_at", "email", "first_name", "id", "last_name", "password", "role_id", "updated_at" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_avatar_id_key" ON "User"("avatar_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
