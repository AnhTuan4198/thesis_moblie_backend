FROM node:15.12.0-alpine3.10

WORKDIR /usr/src/app

RUN git pull origin master

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3030/tcp
CMD [ "nodemon" ]


