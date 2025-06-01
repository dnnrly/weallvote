// Package handlers contains API route handlers.
package controllers

import (
	"context"
	"net/http"
	"strings"
)

type AuthController struct {
	Auth FirebaseAuthProvider
}

func (c *AuthController) LoginHandler(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		http.Error(w, "Missing token", http.StatusUnauthorized)
		return
	}

	idToken := strings.TrimPrefix(authHeader, "Bearer ")
	_, err := c.Auth.VerifyIDToken(context.Background(), idToken)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	// 🔐 Enforce email verification
	// if verified, ok := token.Claims["email_verified"].(bool); !ok || !verified {
	// 	http.Error(w, "Email not verified", http.StatusForbidden)
	// 	return
	// }

	// // ✅ Optional: register user in DB if not already there
	// // uid := token.UID
	// email := token.Claims["email"].(string)

	// db.CreateUserIfNotExists(uid, email)

	// Optional: issue cookie or respond with success
	w.WriteHeader(http.StatusOK)
	// fmt.Fprintf(w, "Logged in as %s\n", email)
}
