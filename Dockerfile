# Build Stage
FROM node:19-alpine AS monero-middleware-builder

# Create app directory
WORKDIR /app

# Copy 'package-lock.json' and 'package.json'
COPY package-lock.json package.json ./

# Install dependencies
RUN npm install --production --fetch-timeout 300000

# Copy project files and folders to the current working directory (i.e. '/app')
COPY . .

# Install UI dependencies and build UI 
RUN npm run install:ui
RUN npm run build:ui

# Final Stage (Production) 
FROM node:19-alpine AS monero-middleware

# Copy built code from build stage to '/app' directory
COPY --from=monero-middleware-builder /app /app

# Change directory to '/app' 
WORKDIR /app

EXPOSE 3006
CMD [ "npm", "start" ]
