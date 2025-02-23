# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install OpenSSL and other necessary dependencies
RUN apk add --no-cache openssl openssl-dev libc6-compat

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including ts-node and typescript
RUN npm install
RUN npm install -g ts-node typescript @types/node
RUN npm install --save-dev @types/bcrypt  # Ajout des types pour bcrypt

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install OpenSSL and ts-node in production image
RUN apk add --no-cache openssl openssl-dev libc6-compat
RUN npm install -g ts-node typescript @types/node

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --production
RUN npm install --save-dev @types/bcrypt  # Ajout des types pour bcrypt ici aussi

# Copy built files and Prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

ENV NODE_ENV=production

EXPOSE 4000

CMD ["npm", "start"]