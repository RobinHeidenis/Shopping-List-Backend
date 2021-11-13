FROM node:17

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY build ./
COPY .env.production ./.env
COPY ./docker/wait-for ./

RUN yarn install --production

RUN apt-get -q update && apt-get -qy install netcat

EXPOSE 3001
