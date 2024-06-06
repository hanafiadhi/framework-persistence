FROM node:20-alpine

WORKDIR /app/

COPY package*.json /app
RUN npm install

COPY . .

ENTRYPOINT ["npm", "run", "start:dev"]
