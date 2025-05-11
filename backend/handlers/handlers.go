// Package handlers contains API route handlers.
package handlers

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"
)

var firebaseApp *firebase.App

// Initialize Firebase app globally (once)
func InitFirebase() {
	opt := option.WithCredentialsFile("admin-sdk-config.json") // 🔁 Replace with actual path
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		panic(fmt.Sprintf("Failed to init Firebase: %v", err))
	}
	firebaseApp = app
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		http.Error(w, "Missing token", http.StatusUnauthorized)
		return
	}

	idToken := strings.TrimPrefix(authHeader, "Bearer ")
	client, _ := firebaseApp.Auth(context.Background())
	token, err := client.VerifyIDToken(context.Background(), idToken)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	// 🔐 Enforce email verification
	if verified, ok := token.Claims["email_verified"].(bool); !ok || !verified {
		http.Error(w, "Email not verified", http.StatusForbidden)
		return
	}

	// ✅ Optional: register user in DB if not already there
	// uid := token.UID
	email := token.Claims["email"].(string)

	// db.CreateUserIfNotExists(uid, email)

	// Optional: issue cookie or respond with success
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Logged in as %s\n", email)
}
