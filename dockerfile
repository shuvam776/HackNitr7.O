
# Stage 1: Build the Frontend
FROM node:18-alpine AS client-build
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup the Backend
FROM node:18-alpine
WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
RUN npm install

# Copy backend source
COPY backend/ ./

# Copy built frontend from Stage 1 to the backend's expected location
# We treat the /app directory in the container as the root wrapper
# So we reconstruct the structure: /app/backend and /app/frontend/dist
COPY --from=client-build /app/frontend/dist ../frontend/dist

# Expose the API port
EXPOSE 5000

# Set production environment
ENV NODE_ENV=production

# Start the server
CMD ["npm", "start"]
