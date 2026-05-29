# ============================================================
# Stage 1: Deps — install workspace deps
# ============================================================
FROM node:22-alpine AS deps

WORKDIR /app

# Copy workspace manifests
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
COPY apps/admin/package.json ./apps/admin/
# Required for prisma resolution
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/

RUN npm ci --ignore-scripts

# ============================================================
# Stage 2: Builder — build shared + UI + Next.js app
# ============================================================
FROM deps AS builder

WORKDIR /app

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

COPY packages/shared/ ./packages/shared/
COPY packages/ui/ ./packages/ui/
COPY apps/admin/ ./apps/admin/
COPY .env.admin ./apps/admin/.env

# Build @ecommerce/shared
RUN npm run build -w @ecommerce/shared

# Build @ecommerce/ui
RUN npm run build -w @ecommerce/ui

# Build Next.js
RUN cd apps/admin && npx next build

# ============================================================
# Stage 3: Production runner (Serve)
# ============================================================
FROM node:22-alpine AS production

WORKDIR /app

# Install serve globally to host the static export
RUN npm install -g serve

# Copy built static files from builder
COPY --from=builder /app/apps/admin/out ./out

EXPOSE 5174

CMD ["serve", "-s", "out", "-p", "5174"]
