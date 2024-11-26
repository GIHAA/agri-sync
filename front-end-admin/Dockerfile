FROM node:18-aphine as builder
WORKDIR /srs
COPY package.json .
COPY package-lock.json .
COPY . .
RUN npm install
