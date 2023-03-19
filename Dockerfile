# Build Stage
FROM node:18-buster-slim AS monero-middleware-builder

# Install tools
# RUN apt-get update \
#     && apt-get install -y build-essential \
#     && apt-get install -y python3

# Create app directory
WORKDIR /app

# Copy 'yarn.lock' and 'package.json'
COPY yarn.lock package.json ./

# Install dependencies
RUN yarn install --production

# Copy project files and folders to the current working directory (i.e. '/app')
COPY . .



RUN yarn install:ui
RUN export NODE_OPTIONS=--openssl-legacy-provider && yarn build:ui


# Final image
FROM node:18-buster-slim AS monero-middleware

# Copy built code from build stage to '/app' directory
COPY --from=monero-middleware-builder /app /app

# Change directory to '/app' 
WORKDIR /app

EXPOSE 8998
CMD [ "yarn", "start" ]
