FROM node:16.20-alpine as builder
RUN npm i -g pnpm

# Set the current working directory inside the container
<<<<<<< HEAD
WORKDIR /app/backend

# Install dependencies
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install

# Copy backend and common source code
COPY /backend ./
COPY /common ../common
=======
WORKDIR /app

COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install

COPY /backend .
COPY common ../common
>>>>>>> 599e782 (feat: use common folder for shared code (e.g. data types) (#402))

RUN pnpm run build

FROM node:16.20-alpine as runner
RUN npm i -g pnpm
WORKDIR /app

COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --production

<<<<<<< HEAD
COPY --from=builder /app/backend/dist ./
=======
COPY --from=builder /app/dist ./dist
COPY backend/database.json backend/buildingLocations.json ./
>>>>>>> 599e782 (feat: use common folder for shared code (e.g. data types) (#402))

EXPOSE 3000

ENV NODE_ENV production

<<<<<<< HEAD
CMD ["node", "backend/src/index.js"]
=======
CMD ["node", "dist/index.js"]
>>>>>>> 599e782 (feat: use common folder for shared code (e.g. data types) (#402))
