CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    -- ADDED: ON DELETE CASCADE for data cleanup
    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    principal NUMERIC(14,2) NOT NULL CHECK (principal > 0),
    annual_interest_rate NUMERIC(5,2) NOT NULL,
    term_months INTEGER NOT NULL CHECK (term_months > 0),
    emi_amount NUMERIC(14,2) NOT NULL,
    -- ADDED: Check constraint for loan status
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    -- ADDED: ON DELETE SET NULL so loan records aren't broken if an employee leaves the company
    reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP
);