FROM node:18.10-alpine3.15 as build
WORKDIR /usr/app

RUN apk add --no-cache --virtual .build-deps make gcc g++ python3

COPY package*.json ./
RUN npm install \
    && apk del .build-deps 

COPY . .
RUN npm run build

FROM node:18.10-alpine3.15
WORKDIR /usr/app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /usr/app/dist ./dist
CMD ["node", "." ]