# Use a base image with Node.js installed
FROM node:21.6.1

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port on which the API server will run
EXPOSE 4000

# Command to run the API server
CMD ["npm", "start"]
