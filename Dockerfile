# --- Stage 1: Frontend Build ---
FROM node:lts-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package.json and package-lock.json/yarn.lock
COPY frontend/package*.json ./

# Install frontend dependencies
# This will install @tailwindcss/cli
RUN npm install

# Copy frontend source code
COPY frontend/ .

# Build the frontend application
# Ensure the build command correctly processes Tailwind v4 via PostCSS
RUN npm run build

# --- Stage 2: Backend Build ---
FROM golang:alpine AS backend-builder

WORKDIR /app/backend

# Copy Go module files
COPY backend/go.mod backend/go.sum ./

# Download Go dependencies
RUN go mod download

# Install goose into the builder image to copy it later
RUN go install github.com/pressly/goose/v3/cmd/goose@latest

RUN apk add build-base

# Copy backend source code
COPY backend/ .

# Copy frontend build output from the frontend-builder stage
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Build the Go application
# CGO_ENABLED=0 is often used for static binaries, good for small final images
RUN CGO_ENABLED=1 go build -v -o app main.go

# --- Stage 3: Final Image ---
FROM alpine:latest

# Install necessary packages: ca-certificates for HTTPS, sqlite for the database driver
RUN apk --no-cache add ca-certificates sqlite

WORKDIR /app

# Copy the built backend application from the backend-builder stage
COPY --from=backend-builder /app/backend/app ./

# Copy the frontend build output
COPY --from=backend-builder /app/frontend/dist /frontend/dist

# Copy migrations and .env file
COPY backend/migrations ./migrations
COPY backend/.env ./

# Copy the goose binary from the backend-builder stage
COPY --from=backend-builder /go/bin/goose /usr/local/bin/goose

# Expose the port the backend listens on
EXPOSE 8080

# Set the entrypoint to run migrations and then start the backend application
# Use 'sh -c' to allow running multiple commands
ENTRYPOINT ["sh", "-c", "goose -dir migrations sqlite3 $DATABASE_URL up && ./app"]

# Note: $DATABASE_URL is escaped so it's evaluated at runtime, not build time
