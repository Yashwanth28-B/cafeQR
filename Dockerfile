
# Multi-stage build for React frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Backend build
FROM node:18-alpine as backend-build
WORKDIR /app/backend
COPY server/package*.json ./
RUN npm ci --only=production

# Production image
FROM node:18-alpine
WORKDIR /app

# Copy backend files
COPY server/ ./
COPY --from=backend-build /app/backend/node_modules ./node_modules

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S qrcafe -u 1001

# Change ownership
RUN chown -R qrcafe:nodejs /app
USER qrcafe

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["node", "server.js"]