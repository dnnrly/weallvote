# --- Stage 1: Frontend Build ---
FROM node:lts-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm run build

# --- Stage 2: Backend Build ---
FROM golang:alpine AS backend-builder

RUN apk add build-base
RUN go install github.com/pressly/goose/v3/cmd/goose@latest

WORKDIR /app/backend

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ .
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist
RUN CGO_ENABLED=1 go build -v -o app main.go

# --- Stage 3: Final Image ---
FROM alpine:latest

# Install necessary packages: ca-certificates for HTTPS, sqlite for the database driver
RUN apk --no-cache add ca-certificates sqlite

WORKDIR /app

COPY --from=backend-builder /app/backend/app ./
COPY --from=backend-builder /app/frontend/dist ./frontend/dist
COPY backend/migrations ./migrations
COPY backend/.env ./
COPY backend/admin-sdk-config.json ./

COPY --from=backend-builder /go/bin/goose /usr/local/bin/goose

ENV FRONTEND_DIST=/app/frontend/dist

# Expose the port the backend listens on
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "goose -dir migrations sqlite3 $DATABASE_URL up && ./app"]

