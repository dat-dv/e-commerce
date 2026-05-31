# ============================================================
# Stage 1: Deps — install workspace deps
# ============================================================
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/
COPY apps/admin/package.json ./apps/admin/

RUN npm ci --ignore-scripts

# ============================================================
# Stage 2: Builder — build shared + Next.js app
# ============================================================
FROM deps AS builder

WORKDIR /app

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

COPY packages/shared/ ./packages/shared/
COPY packages/ui/ ./packages/ui/
COPY apps/frontend/ ./apps/frontend/
COPY .env.frontend ./apps/frontend/.env

# Build @ecommerce/shared
RUN npm run build -w @ecommerce/shared

# Build @ecommerce/ui
RUN npm run build -w @ecommerce/ui

# Generate i18n messages
RUN npm run i18n:gen -w apps/frontend

# Build Next.js — dùng npx next build trực tiếp để bypass prebuild hook
# (prebuild cố rebuild @ecommerce/shared nhưng đã được build ở step trên)
RUN cd apps/frontend && npx next build

# ============================================================
# Stage 3: Production runner
# ============================================================
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=5173

# Copy standalone Next.js runtime output
COPY --from=builder /app/apps/frontend/.next/standalone ./
COPY --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/apps/frontend/messages ./apps/frontend/messages
COPY --from=builder /app/apps/frontend/i18n ./apps/frontend/i18n
COPY --from=builder /app/apps/frontend/.env ./apps/frontend/.env

WORKDIR /app/apps/frontend

EXPOSE 5173

CMD ["node", "server.js"]
