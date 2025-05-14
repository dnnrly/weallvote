# WeAllVote3 Makefile

# Variables
FRONTEND_DIR = frontend
BACKEND_DIR = backend
DOCKER_IMAGE_NAME = weallvote3
DOCKER_TAG = latest
DATABASE_URL ?= $(shell pwd)/app.db

# Default target
.PHONY: all
all: build

# Install dependencies
.PHONY: install
install: install-frontend

.PHONY: install-frontend
install-frontend:
	cd $(FRONTEND_DIR) && npm install

# Build targets
.PHONY: build
build: build-frontend build-backend

.PHONY: build-frontend
build-frontend:
	cd $(FRONTEND_DIR) && npm run build

.PHONY: build-backend
build-backend:
	cd $(BACKEND_DIR) && make build

# Test targets
.PHONY: test
test: test-frontend test-backend

.PHONY: test-frontend
test-frontend:
	cd $(FRONTEND_DIR) && npm run test:unit

.PHONY: test-e2e
test-e2e:
	cd $(FRONTEND_DIR) && npm run test:e2e

.PHONY: test-e2e-docker
test-e2e-docker:
	# Build and start the Docker container in detached mode
	docker compose up --wait	

	# Run the setup script to wait for services to be ready
	cd $(FRONTEND_DIR) && npm run test:e2e:setup
	
	# Run the Playwright tests against the Docker container
	# Store the exit code to return it later
	cd $(FRONTEND_DIR) && PLAYWRIGHT_BASE_URL=http://localhost:8080 npm run test:e2e; TEST_EXIT_CODE=$$?; \
	
	# Cleanup: stop and remove the Docker container regardless of test result
	docker compose down || true;
	
	# Return the original test exit code
	exit $$TEST_EXIT_CODE

# Note: The backend Makefile doesn't have a test target based on the provided context
# If it's added later, this should call that target instead
.PHONY: test-backend
test-backend:
	cd $(BACKEND_DIR) && make test

# Development servers
.PHONY: dev
dev: dev-frontend dev-backend

.PHONY: dev-frontend
dev-frontend:
	cd $(FRONTEND_DIR) && npm run dev

.PHONY: dev-backend
dev-backend:
	cd $(BACKEND_DIR) && make run

# Database operations
.PHONY: db-migrate-up
db-migrate-up:
	cd $(BACKEND_DIR) && make migrate-up DATABASE_URL=$(DATABASE_URL)

.PHONY: db-migrate-down
db-migrate-down:
	cd $(BACKEND_DIR) && make migrate-down DATABASE_URL=$(DATABASE_URL)

.PHONY: db-migrate-status
db-migrate-status:
	cd $(BACKEND_DIR) && make migrate-status DATABASE_URL=$(DATABASE_URL)

# Docker operations
.PHONY: docker-build
docker-build: build
	docker build -t $(DOCKER_IMAGE_NAME):$(DOCKER_TAG) .

.PHONY: docker-run
docker-run:
	docker compose up --abort-on-container-exit --build --remove-orphans --renew-anon-volumes --exit-code-from app --build

# Lint and format
.PHONY: lint
lint: lint-frontend

.PHONY: lint-frontend
lint-frontend:
	cd $(FRONTEND_DIR) && npm run lint

.PHONY: format
format: format-frontend

.PHONY: format-frontend
format-frontend:
	cd $(FRONTEND_DIR) && npm run format

# Clean up
.PHONY: clean
clean: clean-frontend clean-backend

.PHONY: clean-frontend
clean-frontend:
	cd $(FRONTEND_DIR) && rm -rf node_modules dist

.PHONY: clean-backend
clean-backend:
	cd $(BACKEND_DIR) && make clean

# Full pipeline
.PHONY: pipeline
pipeline: clean install build test docker-build