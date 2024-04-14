FROM node:lts-bullseye-slim

WORKDIR /usr/src/app

COPY . .

RUN yarn set version 4.1.1

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
