# ============================================================
# Stage 1: Base — cài deps cho toàn bộ monorepo
# ============================================================
FROM node:22-alpine AS base

WORKDIR /app

# Copy workspace manifests (chỉ các file cần để install deps)
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

# Install tất cả deps (bao gồm devDeps vì cần build)
RUN npm ci --ignore-scripts

# ============================================================
# Stage 2: Builder — build shared package + backend
# ============================================================
FROM base AS builder

WORKDIR /app

# Copy toàn bộ source
COPY packages/shared/ ./packages/shared/
COPY apps/backend/ ./apps/backend/

# Build @ecommerce/shared trước
RUN npm run build -w @ecommerce/shared

# Generate Prisma client
RUN cd apps/backend && npx prisma generate

# Build NestJS
RUN npm run build -w apps/backend

# ============================================================
# Stage 3: Production — chỉ chứa những gì cần thiết để chạy
# ============================================================
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Build tools cần để compile better-sqlite3 native addon.
# Sẽ bị xóa sau khi rebuild xong để giữ image nhỏ.
RUN apk add --no-cache python3 make g++

# Copy workspace manifests để install production deps
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

# Install production deps (--ignore-scripts để tránh side-effects khác)
RUN npm ci --omit=dev --ignore-scripts

# Compile native binding của better-sqlite3 cho linux/arm64 (hoặc amd64)
RUN npm rebuild better-sqlite3

# Xóa build tools để giảm image size
RUN apk del python3 make g++

# Copy built artifacts từ builder
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/generated ./apps/backend/generated

# Copy Prisma schema + seeds (cần để migrate & seed lúc runtime)
COPY apps/backend/prisma ./apps/backend/prisma
COPY apps/backend/prisma.config.ts ./apps/backend/prisma.config.ts

# Re-generate Prisma client trong production node_modules
RUN cd apps/backend && npx prisma generate

WORKDIR /app/apps/backend

EXPOSE 3000

# Chỉ migrate + start — seed được chạy manual qua: docker exec ecommerce-backend npm run db:seed
CMD ["sh", "-c", "mkdir -p prisma/data && npx prisma migrate deploy && npm run start:prod"]