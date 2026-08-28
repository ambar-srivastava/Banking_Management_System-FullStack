const pool = require('../config/db');

async function getCustomerDashboard(userId) {
    const balanceResult = await pool.query(
        `SELECT COUNT(*) AS account_count, COALESCE(SUM(balance),0) AS total_balance FROM accounts WHERE user_id = $1`, [userId]
    );

    const recentTxResult = await pool.query(
        `SELECT t.id, t.type, t.amount, t.balance_after, t.created_at, a.account_number FROM transactions t JOIN accounts a ON t.account_id = a.id WHERE a.user_id = $1 ORDER BY t.created_at DESC LIMIT 5`, [userId]
    );

    const loanSummaryResult = await pool.query(
        `SELECT status, COUNT(*) AS count FROM loans WHERE user_id = $1 GROUP BY status`, [userId]
    );

    return {
        accountCount: parseInt(balanceResult.rows[0].account_count),
        totalBalance: balanceResult.rows[0].total_balance,
        recentTransactions: recentTxResult.rows,
        loanSummery: loanSummaryResult.rows
    };
}

async function getEmployeeDashboard() {
    const pendingLoansResult = await pool.query(
        `SELECT COUNT(*) AS count FROM loans WHERE status = 'pending'`
    );

    const customerCountResult = await pool.query(
        `SELECT COUNT(*) AS count FROM users WHERE role = 'customer'`
    );

    const recentTxResult = await pool.query(
        `SELECT t.id, t.type, t.amount, t.created_at, a.account_number, u.full_name FROM transactions t JOIN accounts a ON t.account_id = a.id JOIN users u ON a.user_id = u.id ORDER BY t.created_at DESC LIMIT 20`
    );

    return {
        pendingLoans: parseInt(pendingLoansResult.rows[0].count),
        totalCustomers: parseInt(customerCountResult.rows[0].count),
        recentTransactions: recentTxResult.rows
    };
}

async function getAdminDashboard() {
    const usersByRoleResult = await pool.query(
        `SELECT role, COUNT(*) AS count FROM users GROUP BY role`
    );

    const totalsResult = await pool.query(
        `SELECT COUNT(*) AS account_count, COALESCE(SUM(balance), 0) AS total_bank_balance
     FROM accounts`
    );

    // Flage unusally large transactions for review - a simple starting point
    const suspiciousResult = await pool.query(
        `SELECT t.id, t.type, t.amount, t.created_at, a.account_number, u.full_name FROM transactions t JOIN accounts a ON t.account_id = a.id JOIN users u ON a.user_id = u.id WHERE t.amount > 100000 ORDER BY t.created_at DESC LIMIT 20`
    )

    return {
        usersByRole: usersByRoleResult.rows,
        totalAccounts: parseInt(totalsResult.rows[0].account_count),
        totalBankBalance: totalsResult.rows[0].total_bank_balance,
        flaggedTransactions: suspiciousResult.rows
    };
}

module.exports = { getCustomerDashboard, getEmployeeDashboard, getAdminDashboard };

