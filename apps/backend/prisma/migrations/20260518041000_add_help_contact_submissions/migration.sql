-- CreateTable
CREATE TABLE "help_contact_submissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "contact_name" TEXT,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT DEFAULT 'help_contact',
    "metadata" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "resolved_at" DATETIME,
    CONSTRAINT "help_contact_submissions_reply_target_check" CHECK (
        "contact_email" IS NOT NULL OR
        "contact_phone" IS NOT NULL
    ),
    CONSTRAINT "help_contact_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "help_contact_submission_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submission_id" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "help_contact_submission_images_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "help_contact_submissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "help_contact_submission_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "help_contact_submissions_user_id_idx" ON "help_contact_submissions"("user_id");

-- CreateIndex
CREATE INDEX "help_contact_submissions_status_created_at_idx" ON "help_contact_submissions"("status", "created_at");

-- CreateIndex
CREATE INDEX "help_contact_submissions_contact_email_idx" ON "help_contact_submissions"("contact_email");

-- CreateIndex
CREATE INDEX "help_contact_submission_images_image_id_idx" ON "help_contact_submission_images"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "help_contact_submission_images_submission_id_image_id_key" ON "help_contact_submission_images"("submission_id", "image_id");
