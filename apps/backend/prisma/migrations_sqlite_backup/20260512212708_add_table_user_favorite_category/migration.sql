-- CreateTable
CREATE TABLE "user_favorite_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "user_favorite_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_favorite_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "user_favorite_categories_user_id_idx" ON "user_favorite_categories"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorite_categories_user_id_category_id_key" ON "user_favorite_categories"("user_id", "category_id");
