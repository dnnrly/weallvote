package repos

import (
	"database/sql"

	"github.com/dnnrly/weallvote/backend/models"
)

type UserRepository struct {
	DB *sql.DB
}

func (r *UserRepository) RegisterUser(user *models.User, userAccount *models.UserAccounts) error {
	return nil
}

func (r *UserRepository) GetUserByProviderID(providerType, providerUserID string) (*models.User, bool, error) {
	return nil, false, nil
}
