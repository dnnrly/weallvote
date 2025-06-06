package controllers

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"firebase.google.com/go/v4/auth"
	"github.com/dnnrly/weallvote/backend/models"
	"github.com/stretchr/testify/assert"
	gomock "go.uber.org/mock/gomock"

	"github.com/dnnrly/weallvote/backend/internal/testmocks"
)

var authToken = &auth.Token{
	UID: "uid-1",
	Claims: map[string]interface{}{
		"email": "test@example.com",
	},
	Firebase: auth.FirebaseInfo{
		SignInProvider: "password",
	},
}

func TestAuthControllerLoginExistingUser(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockAuth := testmocks.NewMockFirebaseAuthProvider(ctrl)
	mockUserRepo := testmocks.NewMockUserRepository(ctrl)
	authController := &AuthController{
		Auth:     mockAuth,
		UserRepo: mockUserRepo,
	}

	mockAuth.EXPECT().
		VerifyIDToken(gomock.Any(), gomock.Eq("test")).
		Return(authToken, nil)
	mockUserRepo.EXPECT().
		GetUserByProviderID(gomock.Eq("password"), gomock.Eq("uid-1")).
		Return(&models.User{}, true, nil)

	recorder := httptest.NewRecorder()
	request := httptest.NewRequest("POST", "/auth/login", nil)
	request.Header.Set("Authorization", "Bearer test")

	authController.LoginHandler(
		recorder,
		request,
	)

	assert.Equal(t, http.StatusOK, recorder.Code)
}

func TestAuthControllerLoginNewUser(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockAuth := testmocks.NewMockFirebaseAuthProvider(ctrl)
	mockUserRepo := testmocks.NewMockUserRepository(ctrl)
	authController := &AuthController{
		Auth:     mockAuth,
		UserRepo: mockUserRepo,
	}

	mockAuth.EXPECT().
		VerifyIDToken(gomock.Any(), gomock.Eq("test")).
		Return(authToken, nil)
	mockUserRepo.EXPECT().
		GetUserByProviderID(gomock.Eq("password"), gomock.Eq("uid-1")).
		Return(nil, false, nil)
	mockUserRepo.EXPECT().
		RegisterUser(gomock.Any(), gomock.Any()).
		DoAndReturn(func(user *models.User, userAccount *models.UserAccounts) error {
			assert.Equal(t, "uid-1", user.ID)
			assert.Equal(t, "test@example.com", user.Email)
			assert.Equal(t, "password", userAccount.ProviderType)
			assert.Equal(t, "uid-1", userAccount.ProviderUserID)
			return nil
		})

	recorder := httptest.NewRecorder()
	request := httptest.NewRequest("POST", "/auth/login", nil)
	request.Header.Set("Authorization", "Bearer test")

	authController.LoginHandler(
		recorder,
		request,
	)

	assert.Equal(t, http.StatusOK, recorder.Code)
}

func TestLoginHandlerInvalidToken(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockAuth := testmocks.NewMockFirebaseAuthProvider(ctrl)
	authController := &AuthController{
		Auth: mockAuth,
	}

	mockAuth.EXPECT().
		VerifyIDToken(gomock.Any(), gomock.Any()).
		Return(nil, errors.New("invalid token"))

	recorder := httptest.NewRecorder()
	request := httptest.NewRequest("POST", "/auth/login", nil)
	request.Header.Set("Authorization", "Bearer test")

	authController.LoginHandler(
		recorder,
		request,
	)

	assert.Equal(t, http.StatusUnauthorized, recorder.Code)
}

func TestLoginHandlerMissingToken(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockAuth := testmocks.NewMockFirebaseAuthProvider(ctrl)
	authController := &AuthController{
		Auth: mockAuth,
	}

	recorder := httptest.NewRecorder()
	request := httptest.NewRequest("POST", "/auth/login", nil)

	authController.LoginHandler(
		recorder,
		request,
	)

	assert.Equal(t, http.StatusUnauthorized, recorder.Code)
}

func TestAuthControllerLoginErrorGettingUser(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockAuth := testmocks.NewMockFirebaseAuthProvider(ctrl)
	mockUserRepo := testmocks.NewMockUserRepository(ctrl)
	authController := &AuthController{
		Auth:     mockAuth,
		UserRepo: mockUserRepo,
	}

	mockAuth.EXPECT().
		VerifyIDToken(gomock.Any(), gomock.Any()).
		Return(authToken, nil)
	mockUserRepo.EXPECT().
		GetUserByProviderID(gomock.Any(), gomock.Any()).
		Return(nil, false, errors.New("error getting user"))

	recorder := httptest.NewRecorder()
	request := httptest.NewRequest("POST", "/auth/login", nil)
	request.Header.Set("Authorization", "Bearer test")

	authController.LoginHandler(
		recorder,
		request,
	)

	assert.Equal(t, http.StatusInternalServerError, recorder.Code)
}

func TestAuthControllerLoginErrorRegisteringUser(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockAuth := testmocks.NewMockFirebaseAuthProvider(ctrl)
	mockUserRepo := testmocks.NewMockUserRepository(ctrl)
	authController := &AuthController{
		Auth:     mockAuth,
		UserRepo: mockUserRepo,
	}

	mockAuth.EXPECT().
		VerifyIDToken(gomock.Any(), gomock.Any()).
		Return(authToken, nil)
	mockUserRepo.EXPECT().
		GetUserByProviderID(gomock.Any(), gomock.Any()).
		Return(nil, false, nil)
	mockUserRepo.EXPECT().
		RegisterUser(gomock.Any(), gomock.Any()).
		Return(errors.New("error registering user"))

	recorder := httptest.NewRecorder()
	request := httptest.NewRequest("POST", "/auth/login", nil)
	request.Header.Set("Authorization", "Bearer test")

	authController.LoginHandler(
		recorder,
		request,
	)

	assert.Equal(t, http.StatusInternalServerError, recorder.Code)
}
