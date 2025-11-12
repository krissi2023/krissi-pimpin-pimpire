FROM registry.access.redhat.com/ubi8/nodejs-18:latest

# Set working directory
WORKDIR /opt/app-root/src

# Copy package files
COPY package*.json ./

# Install dependencies as non-root user
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Create and set ownership of required directories
USER 0
RUN chown -R 1001:0 /opt/app-root/src && \
    chmod -R g=u /opt/app-root/src
USER 1001

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the application
CMD ["npm", "start"]