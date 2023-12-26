FROM mcr.microsoft.com/playwright:v1.40.0-jammy
FROM node:latest

WORKDIR  /app

ENV PATH /app/node_modules/.bin:$PATH

RUN npx playwright install chrome
COPY package*.json /app
COPY playwright.config.ts /app
COPY tests /app/tests
COPY constants /app/constants
COPY pages /app/pages

RUN npm install

CMD ["npm","run","playwright"]