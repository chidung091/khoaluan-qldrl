FROM node:14-alpine as builder

ENV NODE_ENV production

WORKDIR /home/node

COPY ./ .

RUN yarn install && yarn run build && cp .env.production .env

CMD ["node", "dist/main.js"]
