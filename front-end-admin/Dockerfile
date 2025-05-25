# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --force

# Copy rest of the project files
COPY . .

# Build the app
RUN npm run build

# Expose the app port
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
