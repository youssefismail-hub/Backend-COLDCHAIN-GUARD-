# Use a small Node.js base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies (package-lock.json recommended)
COPY package*.json ./

# Install only production deps by default for smaller image. For development, mount the source and run npm install in the container.
RUN npm ci --only=production || npm install

# Bundle app source
COPY . .

# Set environment
ENV NODE_ENV=production

# Expose the port the app listens on
EXPOSE 1234

# Start the app
CMD ["node", "index.js"]
