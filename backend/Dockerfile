# Backend Dockerfile - multi-stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build || true

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app .
RUN npm ci --only=production --silent
EXPOSE 4000
CMD ["node", "server.js"]
