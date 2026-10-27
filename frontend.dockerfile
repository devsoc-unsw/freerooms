# Install dependencies only when needed
FROM node:24-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Install the shared package dependencies before installing its consumers.
WORKDIR /app
COPY common/package.json common/package-lock.json ./common/
RUN npm --prefix common ci

WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN npm --prefix frontend ci

# Rebuild the source code only when needed
FROM node:24-alpine AS builder

# Accept build args for environment variables
ARG NEXT_PUBLIC_STAGING=false

WORKDIR /app
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/common/node_modules ./common/node_modules
COPY frontend ./frontend
COPY common ./common

# Set the environment variable for Next.js build
ENV NEXT_PUBLIC_STAGING=$NEXT_PUBLIC_STAGING

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# RUN npm run build

# If using npm comment out above and use below instead
RUN npm --prefix common run build
RUN npm --prefix frontend run build

# Production image, copy all the files and run next
FROM node:24-alpine AS runner

WORKDIR /app

COPY common/package.json common/package-lock.json ./common/
COPY --from=builder /app/common/dist ./common/dist

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/package.json ./frontend/package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static ./frontend/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "./frontend/server.js"]
