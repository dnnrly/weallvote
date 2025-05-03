package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3" // Import for SQLite driver
)

// Define a struct for the application context (optional but good practice)
type application struct {
	db *sql.DB
}

func main() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: Error loading .env file, using environment defaults")
	}

	// Get database URL from environment variables
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL not set in .env or environment")
	}

	// Open database connection
	db, err := sql.Open("sqlite3", dbURL)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	defer db.Close()

	// Ping database to verify connection
	err = db.Ping()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	log.Println("Database connection established.")

	// Initialize application context
	app := &application{db: db}

	// Run migrations (optional, can be done via Makefile or Docker entrypoint)
	// For simplicity in main, we'll skip running here and rely on Makefile/Docker
	// log.Println("Running database migrations...")
	// if err := goose.Up(db, "./migrations"); err != nil {
	// 	log.Fatalf("Failed to run migrations: %v", err)
	// }
	// log.Println("Migrations completed.")


	// Create a new router
	r := chi.NewRouter()

	// Add middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// Define routes
	r.Get("/healthz", app.healthzHandler)

	// Serve static files from the 'dist' directory (frontend build output)
	// This assumes your frontend build outputs to a 'dist' folder relative to the backend binary
	fs := http.FileServer(http.Dir("../frontend/dist"))
	r.Handle("/*", fs) // Serve frontend files for all other routes

	// Start the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port
	}
	log.Printf("Starting server on :%s", port)
	err = http.ListenAndServe(":"+port, r)
	if err != nil {
		log.Fatal(err)
	}
}

// healthzHandler is a simple handler for the health check endpoint.
func (app *application) healthzHandler(w http.ResponseWriter, r *http.Request) {
	// Check database connection as part of health check
	err := app.db.Ping()
	if err != nil {
		http.Error(w, "Database connection failed", http.StatusInternalServerError)
		log.Printf("Health check failed: Database connection error: %v", err)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "OK")
	log.Println("Health check successful.")
}

// Placeholder for handlers and models (3-tier structure)
// You would typically have separate files for these.

// Example placeholder handler function
// func (app *application) createUserHandler(w http.ResponseWriter, r *http.Request) {
// 	// ... handler logic ...
// }

// Example placeholder model struct
// type User struct {
// 	ID int
// 	Name string
// }

// Example placeholder model function
// func (app *application) insertUser(name string) error {
// 	// ... model logic ...
// 	return nil
// }
