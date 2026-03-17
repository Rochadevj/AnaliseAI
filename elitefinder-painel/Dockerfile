# ===== BUILD STAGE =====
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Copy .env.docker as .env for build (Vite reads .env during build)
COPY .env.docker .env

# Build production bundle (client only for Docker)
RUN pnpm run build:client -- --config vite.config.build.ts

# ===== PRODUCTION STAGE =====
FROM nginx:alpine

# Copy nginx config
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

# Copy built files from builder
COPY --from=builder /app/dist/spa /usr/share/nginx/html

# Create a simple health check script
RUN printf '%s\n' '#!/bin/sh' 'wget --quiet --tries=1 --spider http://localhost:5173/health || exit 1' > /health.sh && \
  chmod +x /health.sh

# Expose port (can be changed to 80 or 3000)
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD /health.sh

CMD ["nginx", "-g", "daemon off;"]
