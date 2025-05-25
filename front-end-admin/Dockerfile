# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies with caching
COPY package*.json ./

# Use npm ci for clean installs, fallback to legacy-peer-deps if needed
RUN npm ci || npm install --legacy-peer-deps

# Copy the rest of the project files
COPY . .

# Build the app
RUN npm run build

# Expose the app port
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
