package controllers

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	gomock "go.uber.org/mock/gomock"
)

func TestLoginHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockAuth := NewMockFirebaseAuthProvider(ctrl)
	authController := &AuthController{
		Auth: mockAuth,
	}

	mockAuth.EXPECT().VerifyIDToken(gomock.Any(), gomock.Any()).Return(nil, nil)

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

	mockAuth := NewMockFirebaseAuthProvider(ctrl)
	authController := &AuthController{
		Auth: mockAuth,
	}

	mockAuth.EXPECT().VerifyIDToken(gomock.Any(), gomock.Any()).Return(nil, errors.New("invalid token"))

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

	mockAuth := NewMockFirebaseAuthProvider(ctrl)
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
