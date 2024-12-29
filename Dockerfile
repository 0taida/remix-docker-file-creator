# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Set environment variables to help with build process
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all necessary project files
COPY . .

# Build Remix app using the production build script
RUN npm run build

# Set up shared volume
VOLUME /shared

# Expose port
EXPOSE 3000

# Start the Remix app
CMD ["npm", "start"]
