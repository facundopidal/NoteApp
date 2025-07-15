FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/generated ./generated
COPY package*.json ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]