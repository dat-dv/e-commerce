/*
  Preserve existing user phone data:
  - phone_number -> phone
  - is_default -> users.active_phone_id
*/
-- DropForeignKey
ALTER TABLE "user_phones" DROP CONSTRAINT "user_phones_user_id_fkey";

-- DropIndex
DROP INDEX IF EXISTS "user_phones_phone_number_key";

-- Rename existing column instead of dropping data
ALTER TABLE "user_phones" RENAME COLUMN "phone_number" TO "phone";

-- Add active phone pointer before backfill
ALTER TABLE "users" ADD COLUMN "active_phone_id" TEXT;

-- Backfill active_phone_id from old default phone
UPDATE "users" u
SET "active_phone_id" = p."id"
FROM "user_phones" p
WHERE p."user_id" = u."id"
  AND p."is_default" = true;

-- Fallback: if no default phone, choose the first phone
UPDATE "users" u
SET "active_phone_id" = p."id"
FROM (
  SELECT DISTINCT ON ("user_id") "id", "user_id"
  FROM "user_phones"
  ORDER BY "user_id", "created_at" ASC
) p
WHERE p."user_id" = u."id"
  AND u."active_phone_id" IS NULL;

-- Now old default flag is no longer needed
ALTER TABLE "user_phones" DROP COLUMN "is_default";

-- Recreate indexes/constraints for new schema
CREATE INDEX "user_phones_user_id_idx" ON "user_phones"("user_id");

CREATE UNIQUE INDEX "user_phones_user_id_phone_key" ON "user_phones"("user_id", "phone");

CREATE UNIQUE INDEX "users_active_phone_id_key" ON "users"("active_phone_id");

ALTER TABLE "users"
ADD CONSTRAINT "users_active_phone_id_fkey"
FOREIGN KEY ("active_phone_id") REFERENCES "user_phones"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "user_phones"
ADD CONSTRAINT "user_phones_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
