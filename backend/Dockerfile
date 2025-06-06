FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache curl && \
    curl -sSL https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -o /usr/local/bin/wait-for-it.sh && \
    chmod +x /usr/local/bin/wait-for-it.sh && \
    apk del curl

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]