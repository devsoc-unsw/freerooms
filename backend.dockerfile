FROM node:16.20-alpine as builder
RUN npm i -g pnpm

# Set the current working directory inside the container
WORKDIR /app/backend

# Install dependencies
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install

# Copy backend and common source code
COPY /backend ./
COPY /common ../common

RUN pnpm run build

FROM node:16.20-alpine as runner
RUN npm i -g pnpm
WORKDIR /app

COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --production

COPY --from=builder /app/backend/dist ./

EXPOSE 3000

ENV NODE_ENV production

CMD ["node", "backend/src/index.js"]
