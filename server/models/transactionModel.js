const pool = require('../config/db');

async function getTransactionHistory(accountId, filters) {
    const { type, startDate, endDate, minAmount, maxAmount, page = 1, limit = 20 } = filters;

    // We build the WHERE clause piece by piece, always using placeholders never raw string interpolation of user input.
    const conditions = ['account_id = $1'];
    const values = [accountId];
    let paramIndex = 2;

    if (type) {
        conditions.push(`type = $${paramIndex}`);
        values.push(type);
        paramIndex++;
    }
    if (startDate) {
        conditions.push(`created_at >= $${paramIndex}`);
        values.push(startDate);
        paramIndex++;
    }
    if (endDate) {
        conditions.push(`created_at <= $${paramIndex}`);
        values.push(endDate);
        paramIndex++;
    }
    if (minAmount) {
        conditions.push(`amount >= $${paramIndex}`);
        values.push(minAmount);
        paramIndex++;
    }
    if (maxAmount) {
        conditions.push(`amount <= $${paramIndex}`);
        values.push(maxAmount);
        paramIndex++;
    }

    const whereClause = conditions.join(' AND ');
    const offset = (page - 1) * limit;

    //Get the matching rows for this page
    const dataQuery = `
    SELECT id, type, amount, balance_after, status, created_at, related_account_id FROM transactions WHERE ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;

    const dataResult = await pool.query(dataQuery, [...values, limit, offset]);

    // Also get the total count, so the frontend knows how many pages exist
    const countQuery = `SELECT COUNT(*) FROM transactions WHERE ${whereClause}`;
    const countResult = await pool.query(countQuery, values);

    return {
        transactions: dataResult.rows,
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        totalPages: Math.ceil(countResult.rows[0].count / limit)
    };
}

async function getStatementData(accountId, startDate, endDate) {
    // Opening balance = balance_after of the last transaction strictly before this period
    const openingResult = await pool.query(
        `SELECT balance_after FROM transactions WHERE account_id = $1 AND created_at < $2 ORDER BY created_at DESC LIMIT 1`, [accountId, startDate]
    );

    const openingBalance = openingResult.rows[0] ? parseFloat(openingResult.rows[0].balance_after) : 0; //no prior transactions means the account started at 0

    // All transactions within the period, oldest first (statements read chronologically)
    const txResult = await pool.query(
        `SELECT id, type, amount, balance_after, created_at FROM transactions WHERE account_id = $1 AND created_at >= $2 AND created_at <= $3 ORDER BY created_at ASC`, [accountId, startDate, endDate]
    );
    const transactions = txResult.rows;

    // Sum credits and debits by type
    let totalCredits = 0;
    let totalDebits = 0;
    for (const tx of transactions) {
        if (tx.type === 'deposit' || tx.type === 'transfer_in') {
            totalCredits += parseFloat(tx.amount);
        } else {
            totalDebits += parseFloat(tx.amount);
        }
    }

    // Closing balance = balance_after of the last transaction in the period
    // (or unchanged from opening, if nothing happened in this period)
    const closingBalance = transactions.length > 0 ? parseFloat(transactions[transactions.length - 1].balance_after) : openingBalance;

    return { openingBalance, closingBalance, totalCredits, totalDebits, transactions };
}

module.exports = { getTransactionHistory, getStatementData };