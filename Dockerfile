FROM node:15.14.0-alpine3.10

WORKDIR /usr/src/app

RUN npm update && npm upgrade

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3030/tcp
CMD [ "node", "index.js" ]