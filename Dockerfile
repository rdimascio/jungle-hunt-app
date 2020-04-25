FROM node:12.10.0-alpine

WORKDIR /var/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /var/app/node_modules/.bin:$PATH

COPY package.json /var/app/package.json
COPY package-lock.json /var/app/package-lock.json

RUN apk --no-cache add python make g++
RUN npm ci -qy --silent
RUN npm i react-scripts@3.4.1 -g --silent

COPY . /var/app

EXPOSE 3000

CMD ["npm", "start"]
