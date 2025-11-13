# Use Node.js 20 Debian slim image (better Prisma compatibility)
FROM node:20-slim

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Prisma schema
COPY prisma ./prisma

# Install dependencies
RUN npm install --production=false

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/index.js"]
