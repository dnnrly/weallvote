package dependencies

import (
	"context"

	"firebase.google.com/go/v4/auth"
	"github.com/dnnrly/weallvote/backend/models"
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
	GetUser(ctx context.Context, uid string) (*auth.UserRecord, error)
}

type UserRepository interface {
	GetUserByProviderID(providerType string, providerUserID string) (*models.User, bool, error)
	RegisterUser(user *models.User, userAccount *models.UserAccounts) error
}
