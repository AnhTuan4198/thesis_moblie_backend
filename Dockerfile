FROM node:15.12.0-alpine3.10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3030/tcp
CMD [ "nodemon" ]


