FROM node:20

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend
COPY . .

# Expose port used by Express
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]