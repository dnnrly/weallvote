package repos

import (
	"database/sql"
	"reflect"
	"testing"

	"github.com/dnnrly/weallvote/backend/models"
)

func TestUserRepository_RegisterUser(t *testing.T) {
	type fields struct {
		DB *sql.DB
	}
	type args struct {
		user        *models.User
		userAccount *models.UserAccounts
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &UserRepository{
				DB: tt.fields.DB,
			}
			if err := r.RegisterUser(tt.args.user, tt.args.userAccount); (err != nil) != tt.wantErr {
				t.Errorf("UserRepository.RegisterUser() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestUserRepository_GetUserByProviderID(t *testing.T) {
	type fields struct {
		DB *sql.DB
	}
	type args struct {
		providerType   string
		providerUserID string
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    *models.User
		want1   bool
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &UserRepository{
				DB: tt.fields.DB,
			}
			got, got1, err := r.GetUserByProviderID(tt.args.providerType, tt.args.providerUserID)
			if (err != nil) != tt.wantErr {
				t.Errorf("UserRepository.GetUserByProviderID() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("UserRepository.GetUserByProviderID() got = %v, want %v", got, tt.want)
			}
			if got1 != tt.want1 {
				t.Errorf("UserRepository.GetUserByProviderID() got1 = %v, want %v", got1, tt.want1)
			}
		})
	}
}
