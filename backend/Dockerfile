# Backend Dockerfile - Fixed for Railway
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with error handling
RUN npm install --production --loglevel=verbose || npm install --production

# Copy source code
COPY . .

# Set environment
ENV NODE_ENV=production

# Expose port (Railway will use its own port via $PORT env var)
EXPOSE 8080

# Start application
CMD ["node", "server.js"]
