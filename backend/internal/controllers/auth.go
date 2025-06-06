// Package handlers contains API route handlers.
package controllers

import (
	"context"
	"net/http"
	"strings"

	"github.com/dnnrly/weallvote/backend/internal/dependencies"
	"github.com/dnnrly/weallvote/backend/models"
)

type AuthController struct {
	Auth     dependencies.FirebaseAuthProvider
	UserRepo dependencies.UserRepository
}

func (c *AuthController) LoginHandler(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		http.Error(w, "Missing token", http.StatusUnauthorized)
		return
	}

	idToken := strings.TrimPrefix(authHeader, "Bearer ")
	token, err := c.Auth.VerifyIDToken(context.Background(), idToken)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	_, found, err := c.UserRepo.GetUserByProviderID(token.Firebase.SignInProvider, token.UID)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	if !found {
		err = c.UserRepo.RegisterUser(&models.User{
			ID:    token.UID,
			Email: token.Claims["email"].(string),
		}, &models.UserAccounts{
			ProviderType:   token.Firebase.SignInProvider,
			ProviderUserID: token.UID,
		})
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
}
