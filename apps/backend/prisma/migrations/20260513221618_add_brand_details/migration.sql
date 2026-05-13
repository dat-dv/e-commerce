-- AlterTable
ALTER TABLE "brand_translations" ADD COLUMN "story" TEXT;

-- AlterTable
ALTER TABLE "brands" ADD COLUMN "banner_url" TEXT;
ALTER TABLE "brands" ADD COLUMN "founded_year" INTEGER;
ALTER TABLE "brands" ADD COLUMN "headquarters" TEXT;
