-- CreateTable
CREATE TABLE "order_support_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "reason" TEXT NOT NULL,
    "admin_note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "order_support_requests_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "order_support_request_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "request_id" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_support_request_images_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "order_support_requests" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_support_request_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "order_support_request_images_image_id_idx" ON "order_support_request_images"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_support_request_images_request_id_image_id_key" ON "order_support_request_images"("request_id", "image_id");
