# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# Build Remix app
RUN npm run build

# Set up shared volume
VOLUME /shared

# Expose port
EXPOSE 3000

# Start the Remix app
CMD ["npm", "start"]
