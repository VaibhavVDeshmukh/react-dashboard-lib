# Use a node.js base image with a specific version
FROM node:18

# Set the working directory inside the container
WORKDIR /app/dashboard-builder

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the project
RUN npm run build

# Link the dashboard-builder package globally
RUN npm link

# Switch to stm-client directory
WORKDIR /app/s2m-client

# Link dashboard-builder package in stm-client
RUN npm link dashboard-builder

# Expose any necessary ports (if your application requires it)
# EXPOSE 3000

# Specify the command to run your application
CMD ["npm", "start"]