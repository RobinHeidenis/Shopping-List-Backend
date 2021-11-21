FROM node:17.1.0 as build

WORKDIR /usr/src/app

COPY . .

RUN yarn install
RUN yarn build

FROM node:17.1.0 as modules

WORKDIR /usr/src/app

COPY ./package.json ./yarn.lock ./

RUN yarn install --production

FROM node:17.1.0-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/build ./build
COPY --from=modules /usr/src/app/node_modules ./node_modules
COPY .env.production ./.env

EXPOSE 3001

CMD ["node", "build/server/server.js"]
