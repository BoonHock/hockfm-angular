FROM node:18-alpine3.16

WORKDIR /usr/src/app

RUN npm install -g @angular/cli

COPY ./package*.json ./
RUN npm ci

EXPOSE 4200 49153

COPY . .

CMD ["npm", "start"]