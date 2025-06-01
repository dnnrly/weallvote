package controllers

import (
	"context"

	"firebase.google.com/go/v4/auth"
)

type Logger interface {
	Info(v ...any)
	Error(v ...any)
}

type DB interface {
	Ping() error
}

type FirebaseAuthProvider interface {
	VerifyIDToken(ctx context.Context, idToken string) (*auth.Token, error)
}
