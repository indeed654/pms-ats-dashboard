# Use official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy rest of backend code
COPY . .

# Expose backend port
EXPOSE 8000

# Start server
CMD ["node", "main.js"]
