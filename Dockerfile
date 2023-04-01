# Build Stage
FROM node:19-bullseye-slim AS monero-middleware-builder

# Create app directory
WORKDIR /app

# Copy 'yarn.lock' and 'package.json'
COPY yarn.lock package.json ./

# Install dependencies
RUN yarn install --production

# Copy project files and folders to the current working directory (i.e. '/app')
COPY . .

# Install UI dependencies and build UI 
RUN yarn install:ui
RUN yarn build:ui

# Final Stage (Production) 
FROM node:19-bullseye-slim AS monero-middleware

# Copy built code from build stage to '/app' directory
COPY --from=monero-middleware-builder /app /app

# Change directory to '/app' 
WORKDIR /app

EXPOSE 3006
CMD [ "yarn", "start" ]
