# ============================================================
# Stage 1: Base — cài deps cho toàn bộ monorepo
# ============================================================
FROM node:22-alpine AS base

WORKDIR /app

# Copy workspace manifests (chỉ các file cần để install deps)
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/
COPY apps/admin/package.json ./apps/admin/

# Install tất cả deps (bao gồm devDeps vì cần build)
RUN npm ci --ignore-scripts

# ============================================================
# Stage 2: Builder — build shared package + backend
# ============================================================
FROM base AS builder

WORKDIR /app
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

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
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Copy workspace manifests để install production deps
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/
COPY apps/admin/package.json ./apps/admin/

# Install production deps (--ignore-scripts để tránh side-effects khác)
RUN npm ci --omit=dev --ignore-scripts

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

# Chỉ migrate + start — seed được chạy manual qua: docker exec ecommerce-backend npm run db:reset
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
