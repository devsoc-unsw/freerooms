FROM node:24.18-alpine as builder

# Set the current working directory inside the container
WORKDIR /app

# Install the shared package dependencies before installing its consumers.
COPY common/package.json common/package-lock.json ./common/
RUN npm --prefix common ci

# Install backend dependencies and copy source code.
COPY backend/package.json backend/package-lock.json ./backend/
RUN npm --prefix backend ci
COPY backend ./backend
COPY common ./common

RUN npm --prefix common run build
RUN npm --prefix backend run build

FROM node:24.18-alpine as runner
WORKDIR /app

COPY backend/package.json backend/package-lock.json ./backend/
COPY common/package.json common/package-lock.json ./common/
COPY --from=builder /app/common/dist ./common/dist
RUN npm --prefix common ci --omit=dev
RUN npm --prefix backend ci --omit=dev

COPY --from=builder /app/backend/dist ./backend/dist

EXPOSE 3000

ENV NODE_ENV production

CMD ["node", "backend/src/index.js"]
