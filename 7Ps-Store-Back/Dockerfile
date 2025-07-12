# Use the official Node.js 18 image as the base
FROM node:18-slim

# Install system dependencies required for Playwright
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    libgconf-2-4 \
    libunwind8 \
    libxss1 \
    libx11-dev \
    libxext-dev \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libdrm2 \
    libglib2.0-0 \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libxcb1 \
    libxkbcommon0 \
    libatspi2.0-0 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libdrm2 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /7ps-store-back

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Playwright
RUN npx playwright install-deps
RUN npx playwright install chromium

ENV TZ=Asia/Riyadh

# Create directory for sample files
RUN mkdir -p /7ps-store-back

# Copy application files
COPY . .

# Ensure correct permissions
RUN chmod +x /7ps-store-back/sample.html
RUN chmod +x /7ps-store-back/supported-competitions.yaml

# Expose port
EXPOSE 4800

# Start application
CMD ["npm", "start"]
