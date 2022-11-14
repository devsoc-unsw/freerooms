FROM node:16.15-alpine as builder

RUN npm i -g pnpm

# Set the current working directory inside the container
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:16.15-alpine as runner

WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY --from=builder /app/dist ./dist

ENV NODE_ENV production

COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && \
    pnpm install --production && \
    pnpm store prune && \
    rm -rf /root/.local/share/pnpm && \
    apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont && \
    addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
USER pptruser

EXPOSE 3000

CMD ["node", "dist/index.js"]
