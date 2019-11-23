FROM node

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package*.json ./
RUN npm i -q

COPY . ./

CMD ["npm", "run", "serve:dev"]
