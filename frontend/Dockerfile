FROM node:18-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install --frozen-lockfile || yarn install --frozen-lockfile
COPY . .
RUN npm run build
EXPOSE 3000

CMD ["npm", "start"]
