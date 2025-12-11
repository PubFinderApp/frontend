# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install specific pnpm version
RUN npm install -g pnpm@8

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build argument for API URL
ARG NEXT_PUBLIC_API_BASE_URL=http://207.154.237.0:8080
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install specific pnpm version
RUN npm install -g pnpm@8

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy Next.js config if it exists (handle both .js and .mjs)
COPY --from=builder /app/next.config.* ./

# Expose the port
EXPOSE 3000

# Start the application in production mode
CMD ["pnpm", "start"]