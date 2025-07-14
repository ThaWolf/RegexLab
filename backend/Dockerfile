FROM node:18-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install --production=false --frozen-lockfile || yarn install --frozen-lockfile
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main"]
