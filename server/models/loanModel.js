const pool = require('../config/db');
async function createLoan(userId, accountId, principal, rate, termMonths, emiAmount) {
    const result = await pool.query(
        `INSERT INTO loans (user_id, account_id, principal, annual_interest_rate, term_months, emi_amount, status) VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *`, [userId, accountId, principal, rate, termMonths, emiAmount]
    );
    return result.rows[0];
}

async function findLoansByUserId(userId) {
    const result = await pool.query('SELECT * FROM loans WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
}

// async function findPendingLoans() {
//     const result = await pool.query(`SELECT * FROM loans WHERE status = 'pending' ORDER BY created_at ASC`);
//     return result.rows;
// }

async function findPendingLoans() {
    const result = await pool.query(`
    SELECT l.*, u.full_name, u.email, a.account_number
    FROM loans l
    JOIN users u ON l.user_id = u.id
    JOIN accounts a ON l.account_id = a.id
    WHERE l.status = 'pending'
    ORDER BY l.created_at ASC
  `)
    return result.rows
}

async function findLoanById(loanId) {
    const result = await pool.query('SELECT * FROM loans WHERE id = $1', [loanId]);
    return result.rows[0];
}

async function reviewLoan(loanId, status, reviewerId) {
    const result = await pool.query(
        `UPDATE loans SET status = $1, reviewed_by = $2, reviewed_at = NOW() WHERE id = $3 AND status = 'pending' RETURNING *`, [status, reviewerId, loanId]
    );
    return result.rows[0]; // undefined if the loan didn't exist or wasn't pending
}

module.exports = { createLoan, findLoansByUserId, findPendingLoans, findLoanById, reviewLoan };
