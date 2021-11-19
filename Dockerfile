FROM node:17.1.0 as build

WORKDIR /usr/src/app

COPY . .

RUN yarn install
RUN yarn build

FROM node:17.1.0 as modules

WORKDIR /usr/src/app

COPY ./package.json ./yarn.lock ./

RUN yarn install --production

FROM node:17.1.0-alpine3.14

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/build ./build
COPY --chown=node:node --from=modules /usr/src/app/node_modules ./node_modules
COPY --chown=node:node ./docker/wait-for .
COPY --chown=node:node .env.production ./.env
RUN apk add netcat-openbsd
RUN apk add dumb-init

USER node

EXPOSE 3001

CMD ["sh", "-c", "node build/server/server.js --unhandled-rejections=strict"]
