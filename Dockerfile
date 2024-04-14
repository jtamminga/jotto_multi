FROM node:lts-bullseye-slim

ARG REACT_APP_SERVER_URL=http://192.168.0.100:4001

WORKDIR /usr/src/app

COPY . .

RUN yarn set version 4.1.1

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
