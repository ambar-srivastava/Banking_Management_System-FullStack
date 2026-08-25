CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    -- ADDED: Check constraint to lock down roles
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'employee', 'admin')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    -- ADDED: Check constraint for valid account types
    account_type VARCHAR(20) NOT NULL DEFAULT 'savings' CHECK (account_type IN ('savings', 'checking')),
    balance NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'suspended')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    -- ADDED: ON DELETE CASCADE so transactions drop if the primary account is deleted
    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    -- ADDED: ON DELETE SET NULL so the record survives if the destination account is closed
    related_account_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL,
    amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    balance_after NUMERIC(14,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT NOW()
);