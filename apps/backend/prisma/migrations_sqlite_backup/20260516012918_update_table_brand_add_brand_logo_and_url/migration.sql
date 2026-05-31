-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_brands" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "logo_id" TEXT,
    "banner_id" TEXT,
    "logo_url" TEXT,
    "banner_url" TEXT,
    "website_url" TEXT,
    "founded_year" INTEGER,
    "headquarters" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "brands_logo_id_fkey" FOREIGN KEY ("logo_id") REFERENCES "images" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "brands_banner_id_fkey" FOREIGN KEY ("banner_id") REFERENCES "images" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_brands" ("banner_url", "created_at", "founded_year", "headquarters", "id", "is_featured", "is_verified", "logo_url", "order", "slug", "updated_at", "website_url") SELECT "banner_url", "created_at", "founded_year", "headquarters", "id", "is_featured", "is_verified", "logo_url", "order", "slug", "updated_at", "website_url" FROM "brands";
DROP TABLE "brands";
ALTER TABLE "new_brands" RENAME TO "brands";
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");
CREATE UNIQUE INDEX "brands_logo_id_key" ON "brands"("logo_id");
CREATE UNIQUE INDEX "brands_banner_id_key" ON "brands"("banner_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
