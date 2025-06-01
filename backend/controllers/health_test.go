package controllers

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	gomock "go.uber.org/mock/gomock"
)

func TestHealthzHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockDB := NewMockDB(ctrl)
	mockLogger := NewMockLogger(ctrl)
	healthController := &HealthController{
		DB:     mockDB,
		Logger: mockLogger,
	}

	mockDB.EXPECT().Ping().Return(nil)
	mockLogger.EXPECT().Error(gomock.Any()).Times(0)

	recorder := httptest.NewRecorder()
	request := httptest.NewRequest("GET", "/healthz", nil)

	healthController.HealthzHandler(
		recorder,
		request,
	)

	assert.Equal(t, http.StatusOK, recorder.Code)
	assert.Equal(t, "OK\n", recorder.Body.String())
}

func TestHealthzHandlerDBError(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockDB := NewMockDB(ctrl)
	mockLogger := NewMockLogger(ctrl)
	healthController := &HealthController{
		DB:     mockDB,
		Logger: mockLogger,
	}

	mockDB.EXPECT().Ping().Return(errors.New("ping error"))
	mockLogger.EXPECT().Error("Database connection failed")

	recorder := httptest.NewRecorder()
	request := httptest.NewRequest("GET", "/healthz", nil)

	healthController.HealthzHandler(
		recorder,
		request,
	)

	assert.Equal(t, http.StatusInternalServerError, recorder.Code)
	assert.Equal(t, "Not OK\n", recorder.Body.String())
}
