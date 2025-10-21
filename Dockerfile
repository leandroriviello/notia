FROM node:20-alpine
WORKDIR /app

# Needed for Prisma binary on Alpine
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
