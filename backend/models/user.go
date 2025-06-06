package models

type User struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	PreferredName string `json:"preferred_name"`
	CreatedAt     string `json:"created_at"`
	UpdatedAt     string `json:"updated_at"`
}

type UserAccounts struct {
	ID             string `json:"-"`
	UserID         string `json:"-"`
	ProviderType   string `json:"-"`
	ProviderUserID string `json:"-"`
}
