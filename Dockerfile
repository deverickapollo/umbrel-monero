# Build Stage
FROM node:19-alpine AS monero-middleware-builder

# Create app directory
WORKDIR /app

# Copy 'package.json'
COPY package.json ./

# Install dependencies
RUN npm install --only=production --verbose --unsafe-perm=true 

# Copy project files and folders to the current working directory (i.e. '/app')
COPY . .

# Install UI dependencies and build UI 
RUN yarn install:ui
RUN yarn build:ui

# Final Stage (Production) 
FROM node:19-alpine AS monero-middleware

# Copy built code from build stage to '/app' directory
COPY --from=monero-middleware-builder /app /app

# Change directory to '/app' 
WORKDIR /app

EXPOSE 3006
CMD [ "yarn", "start" ]
