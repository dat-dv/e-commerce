-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "post_id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE CASCADE ON UPDATE NO ACTION
);
INSERT INTO "new_Post" ("content", "created_at", "post_id", "title", "updated_at", "user_id") SELECT "content", "created_at", "post_id", "title", "updated_at", "user_id" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
