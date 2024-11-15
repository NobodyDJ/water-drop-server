FROM node:18.20.0 AS builder

COPY . .

RUN npm install pnpm -g && pnpm install --force && pnpm run build

FROM node:18.20.0

WORKDIR /opt/app

COPY --from=builder ./node_modules ./node_modules
COPY --from=builder ./dist ./dist

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/main"]