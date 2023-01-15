FROM node:16.19-alpine as builder
RUN npm i -g pnpm

# Set the current working directory inside the container
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:16.19-alpine as runner
RUN npm i -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --production

COPY --from=builder /app/dist ./dist
COPY database.json ./

EXPOSE 3000

ENV NODE_ENV production

CMD ["node", "dist/index.js"]
