FROM node:latest

WORKDIR /app
# COPY package*.json ./
# RUN npm install

COPY . /app/

EXPOSE 4000

CMD [ "npm", "start" ]