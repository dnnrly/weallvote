package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"os"

	firebase "firebase.google.com/go/v4"
	"github.com/dnnrly/gobail"
	"github.com/dnnrly/weallvote/backend/internal/controllers"
	"github.com/dnnrly/weallvote/backend/internal/repos"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3" // Import for SQLite driver
	"google.golang.org/api/option"
)

// Define a struct for the application context (optional but good practice)
type application struct {
	authController   *controllers.AuthController
	healthController *controllers.HealthController
}

func main() {
	// Load environment variables from .env file
	gobail.Run(godotenv.Load()).OrExitMsg("Failed to load .env file")

	// Get database URL from environment variables
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL not set in .env or environment")
	}

	// Open database connection
	db := gobail.Return(sql.Open("sqlite3", dbURL)).OrExitMsg("Failed to open database")
	defer db.Close()

	// Ping database to verify connection
	gobail.Run(db.Ping()).OrExitMsg("Failed to connect to database")
	log.Println("Database connection established.")

	firebaseApp := InitFirebase()
	authClient := gobail.Return(firebaseApp.Auth(context.Background())).OrExitMsg("Cannot initialize Firebase Auth")

	userRepo := &repos.UserRepository{
		DB: db,
	}
	// Initialize application context
	app := &application{
		authController: &controllers.AuthController{
			Auth:     authClient,
			UserRepo: userRepo,
		},
		healthController: &controllers.HealthController{
			DB: db,
		},
	}

	// Create a new router
	r := chi.NewRouter()

	// Add middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Post("/auth/login", app.authController.LoginHandler)

	r.Get("/healthz", app.healthController.HealthzHandler)

	// Serve static files from the 'dist' directory (frontend build output)
	// This assumes your frontend build outputs to a 'dist' folder relative to the backend binary
	fs := http.FileServer(http.Dir(os.Getenv("FRONTEND_DIST")))
	r.Handle("/*", fs) // Serve frontend files for all other routes

	// Start the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port
	}
	log.Printf("Starting server on :%s", port)
	gobail.Run(http.ListenAndServe(":"+port, r)).OrExitMsg("Failed to start server")
}

func InitFirebase() *firebase.App {
	opt := option.WithCredentialsFile("admin-sdk-config.json") // 🔁 Replace with actual path
	app := gobail.Return(firebase.NewApp(context.Background(), nil, opt)).OrExitMsg("Failed to init Firebase")

	return app
}
