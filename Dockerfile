# Multi-stage Dockerfile for React + Express application

# Stage 1: Build React client
FROM node:18-alpine AS client-builder

WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install client dependencies
RUN npm ci --only=production=false

# Copy client source code
COPY client/ ./

# Build React application
RUN npm run build

# Stage 2: Build and run Express server
FROM node:18-alpine AS server

WORKDIR /app

# Copy server package files
COPY server/package*.json ./

# Install server dependencies
RUN npm ci --only=production

# Copy server source code
COPY server/ ./

# Copy built React app from client-builder stage
COPY --from=client-builder /app/client/build ./public

# Expose port
EXPOSE 5000

# Set environment variables (can be overridden at runtime)
ENV PORT=5000
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["node", "index.js"]
