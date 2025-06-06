-- +goose Up
-- Enable foreign keys enforcement (needs to be run for each database connection)
PRAGMA foreign_keys = ON;

-- Table 1: users
-- Stores core user profile data, independent of the authentication provider
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  preferred_name TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: user_auth_accounts
-- Links an internal user to an external authentication provider account
CREATE TABLE user_auth_accounts (
  -- Same as users.id, store UUID string, generate in application
  id TEXT PRIMARY KEY, -- Unique ID for this specific linkage record
  -- Foreign Key linking to the users table. Use TEXT to match users.id type.
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE, -- Foreign Key linking to the internal user
  provider_type TEXT NOT NULL, -- Use TEXT for VARCHAR
  provider_user_id TEXT NOT NULL, -- The unique ID *from the external provider* (e.g., Firebase UID - store as TEXT)
  UNIQUE (provider_type, provider_user_id)
);

-- +goose Down
DROP TABLE IF EXISTS user_auth_accounts;
DROP TABLE IF EXISTS users;
