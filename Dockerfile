FROM node:17.1.0 as build

WORKDIR /usr/src/app

COPY . .

RUN yarn install
RUN yarn build

FROM node:17.1.0 as modules

WORKDIR /usr/src/app

COPY ./package.json ./yarn.lock ./

RUN yarn install --production

FROM node:17.1.0-alpine3.12@sha256:9dd79d902bfc8d0fc956527a9c41e2a0a70b452e97c13de27a5248bfa5341bc0

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/build ./build
COPY --from=modules /usr/src/app/node_modules ./node_modules
COPY .env.production ./.env

HEALTHCHECK  --interval=30s --timeout=3s --start-period=20s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

EXPOSE 3001

CMD ["node", "build/server/server.js"]
