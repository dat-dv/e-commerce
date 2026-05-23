# ============================================================
# Stage 1: Deps — install workspace deps
# ============================================================
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/frontend/package.json ./apps/frontend/
# Cần backend/package.json để npm workspace resolve @prisma/client
# (@ecommerce/shared dist import @prisma/client/runtime/index-browser)
COPY apps/backend/package.json ./apps/backend/

RUN npm ci --ignore-scripts

# ============================================================
# Stage 2: Builder — build shared + Next.js app
# ============================================================
FROM deps AS builder

WORKDIR /app

# Build-time env vars (NEXT_PUBLIC_* phải có lúc next build)
ARG NEXT_PUBLIC_API_URL=http://localhost:3000/api
ARG NEXT_PUBLIC_SITE_URL=http://localhost:5173
ARG NEXT_PUBLIC_FIREBASE_API_KEY=""
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
ARG NEXT_PUBLIC_FIREBASE_APP_ID=""
ARG NEXT_PUBLIC_FIREBASE_VAPID_KEY=""
ARG API_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV API_URL=$API_URL
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
ENV NEXT_PUBLIC_FIREBASE_VAPID_KEY=$NEXT_PUBLIC_FIREBASE_VAPID_KEY
ENV NEXT_PUBLIC_CF_SITE_KEY=$NEXT_PUBLIC_CF_SITE_KEY

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

COPY packages/shared/ ./packages/shared/
COPY apps/frontend/ ./apps/frontend/

# Build @ecommerce/shared
RUN npm run build -w @ecommerce/shared

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

# Copy workspace manifests
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/

# Production deps only
RUN npm ci --omit=dev --ignore-scripts

# Copy shared dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

# Copy Next.js build output
COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/apps/frontend/next.config.ts ./apps/frontend/next.config.ts
COPY --from=builder /app/apps/frontend/messages ./apps/frontend/messages
COPY --from=builder /app/apps/frontend/i18n ./apps/frontend/i18n

WORKDIR /app/apps/frontend

EXPOSE 5173

CMD ["npx", "next", "start", "-p", "5173"]
