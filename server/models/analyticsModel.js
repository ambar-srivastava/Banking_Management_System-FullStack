const pool = require('../config/db')

async function getMonthlyTrend(userId, months = 6) {
    const result = await pool.query(
        `SELECT
       date_trunc('month', t.created_at) AS month,
       SUM(CASE WHEN t.type IN ('deposit', 'transfer_in') THEN t.amount ELSE 0 END) AS income,
       SUM(CASE WHEN t.type IN ('withdrawal', 'transfer_out') THEN t.amount ELSE 0 END) AS expense
     FROM transactions t
     JOIN accounts a ON t.account_id = a.id
     WHERE a.user_id = $1
       AND t.created_at >= date_trunc('month', NOW()) - make_interval(months => $2::int)
     GROUP BY month
     ORDER BY month ASC`,
        [userId, months - 1]
    )
    return result.rows;
}

async function getSpendingByType(userId, months = 6) {
    const result = await pool.query(
        `SELECT t.type, SUM(t.amount) AS total
     FROM transactions t
     JOIN accounts a ON t.account_id = a.id
     WHERE a.user_id = $1
       AND t.type IN ('withdrawal', 'transfer_out')
       AND t.created_at >= date_trunc('month', NOW()) - make_interval(months => $2::int)
     GROUP BY t.type`,
        [userId, months - 1]
    )
    return result.rows;
}

async function getBalanceTrend(accountId) {
    const result = await pool.query(
        `SELECT created_at, balance_after FROM transactions WHERE account_id = $1 ORDER BY created_at ASC`,
        [accountId]
    )
    return result.rows;
}

module.exports = { getMonthlyTrend, getSpendingByType, getBalanceTrend }