package controllers

import (
	"fmt"
	"net/http"

	"github.com/dnnrly/weallvote/backend/internal/dependencies"
)

type HealthController struct {
	DB     dependencies.DB
	Logger dependencies.Logger
}

func (c *HealthController) HealthzHandler(w http.ResponseWriter, r *http.Request) {
	// Check database connection as part of health check
	err := c.DB.Ping()
	if err != nil {
		c.Logger.Error("Database connection failed")
		http.Error(w, "Not OK", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "OK")
}
