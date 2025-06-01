# Makefile for Go Backend

# Default target: run the application
.PHONY: all
all: run

# Environment variable for database URL
DATABASE_URL ?= ./data/app.db

.PHONY: tools
tools: ## install tools necessary to build and test this application
	go install github.com/mfridman/tparse@v0.13.2
	go install go.uber.org/mock/mockgen@v0.5.2

# Build the Go application
.PHONY: build
build:
	@echo "Building Go application..."
	CGO_ENABLED=1 go build -o app main.go
	@echo "Build complete."

.PHONY: test
test:
	@echo "Running Go tests..."
	go test -run COMPILE_ONLY
	go test -race -cover -count=1 -json ./... | tparse -all
	@echo "Tests complete."

.PHONY: ci-test
ci-test: ## ci target - run tests to generate coverage data
	rm -rf ./tmp/coverage/ci-test.txt
	mkdir -p ./tmp/coverage
	go test -tags fuzz -coverprofile=./tmp/coverage/ci-test.txt -covermode=set ./...

.PHONY: mocks
mocks:
	@echo "Generating mocks..."
	mockgen -package controllers -source ./controllers/dependencies.go -destination ./controllers/dependencies_test.go
	@echo "Mocks generated."

# Run the Go application
.PHONY: run
run: build
	@echo "Running Go application..."
	DATABASE_URL=$(DATABASE_URL) ./app

# Run database migrations up
.PHONY: migrate-up
migrate-up:
	@echo "Running database migrations up..."
	goose -dir migrations sqlite3 $(DATABASE_URL) up
	@echo "Migrations up complete."

# Run database migrations down
.PHONY: migrate-down
migrate-down:
	@echo "Running database migrations down..."
	goose -dir migrations sqlite3 $(DATABASE_URL) down
	@echo "Migrations down complete."

# Check database migration status
.PHONY: migrate-status
migrate-status:
	@echo "Checking database migration status..."
	goose -dir migrations sqlite3 $(DATABASE_URL) status
	@echo "Migration status checked."

# Clean build artifacts
.PHONY: clean
clean:
	@echo "Cleaning build artifacts..."
	rm -f app
	@echo "Clean complete."

