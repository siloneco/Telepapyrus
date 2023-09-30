# npm install
FROM node:20-alpine@sha256:37750e51d61bef92165b2e29a77da4277ba0777258446b7a9c99511f119db096 AS dependency

WORKDIR /work

COPY package.json package-lock.json ./
RUN  npm install --production

# build Next.js project
FROM node:20-alpine@sha256:37750e51d61bef92165b2e29a77da4277ba0777258446b7a9c99511f119db096 AS builder

WORKDIR /work
COPY --from=dependency /work/node_modules ./node_modules

COPY ./src ./src
COPY package.json .
COPY tsconfig.json .
COPY next.config.js .
COPY .env.build ./.env.local

RUN npm run build

# create runner image
FROM node:20-alpine@sha256:37750e51d61bef92165b2e29a77da4277ba0777258446b7a9c99511f119db096 AS runner

WORKDIR /app

COPY --from=builder /work/.next ./.next
COPY --from=builder /work/node_modules ./node_modules
COPY --from=builder /work/package.json ./package.json

CMD ["npm", "run", "start"]
