# Use the official Node.js image as a base image
FROM node:18-alpine

# Install build tools
RUN apk add --no-cache python3 make g++

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies, including devDependencies
RUN npm install --include=dev

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
