FROM node:16.15-alpine as builder

# Set the current working directory inside the container
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

FROM caddy:2.6.2-alpine
COPY ./Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/dist /srv 

