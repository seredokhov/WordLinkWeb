FROM node:20-alpine
WORKDIR /usr/src/app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
COPY ./src ./src
COPY ./.env ./
COPY ./config.js ./
COPY ./seed-prod-dictionaries.js ./
CMD ["npm", "start"]
