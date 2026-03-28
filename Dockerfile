FROM node:24

WORKDIR /app

COPY package.json package-lock.json* yarn.lock ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev", "--", "--host"]