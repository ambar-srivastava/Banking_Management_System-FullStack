const pool = require('../config/db');

async function createAccount(userId, accountNumber, accountType) {
    const result = await pool.query(
        `INSERT INTO accounts (user_id, account_number, account_type, balance, status) VALUES ($1,$2,$3, 0.00, 'active') RETURNING id, account_number, account_type, balance, status, created_at`, [userId, accountNumber, accountType]
    );
    return result.rows[0];
}

async function findAccountsByUserId(userId) {
    const result = await pool.query(
        `SELECT id, account_number, account_type, balance, status, created_at FROM accounts WHERE user_id = $1 ORDER BY created_at DESC`, [userId]
    );
    return result.rows;
}

async function findAccountById(accountId) {
    const result = await pool.query(
        'SELECT * FROM accounts WHERE id = $1', [accountId]
    );
    return result.rows[0];
}

async function transferFunds(senderAccountId, recieverAccountNumber, amount) {
    const client = await pool.connect(); // grab a dedicated connection for this transaction

    try {
        await client.query('BEGIN');

        // 1. Lock and read the sender's account
        const senderResult = await client.query(
            'SELECT *FROM accounts WHERE id = $1 FOR UPDATE', [senderAccountId]
        );
        const sender = senderResult.rows[0];

        if (!sender) {
            throw { status: 404, message: 'Sender accunt not found' };
        }
        if (sender.status !== 'active') {
            throw { status: 400, message: 'Sender account is not active' };
        }

        // 2. Lock and read the reciever's account
        const recieverResult = await client.query(
            'SELECT * FROM accounts WHERE account_number = $1 FOR UPDATE', [recieverAccountNumber]
        );
        const reciever = recieverResult.rows[0];

        if (!reciever) {
            throw { status: 404, message: 'Reciever account not found' };
        }
        if (reciever.id === sender.id) {
            throw { status: 400, message: 'Cannot transfer to the same account' };
        }

        // 3. Check sufficient funds
        if (parseFloat(sender.balance) < amount) {
            throw { status: 400, message: 'Insufficient funds' };
        }

        // 4. Update bth balances
        const newSenderBalance = (parseFloat(sender.balance) - amount).toFixed(2);
        const newRecieverBalance = (parseFloat(reciever.balance) + amount).toFixed(2);

        await client.query('UPDATE accounts SET balance = $1 WHERE id = $2', [newSenderBalance, sender.id]);
        await client.query('UPDATE accounts SET balance = $1 WHERE id = $2', [newRecieverBalance, reciever.id]);

        // 5. Record both sides of the transaction
        await client.query(`INSERT INTO transactions (account_id, related_account_id, type, amount, balance_after, status) VALUES ($1, $2, 'transfer_out', $3, $4, 'completed')`, [sender.id, reciever.id, amount, newSenderBalance]);
        await client.query(
            `INSERT INTO transactions (account_id, related_account_id, type, amount, balance_after, status) VALUES ($1, $2, 'transfer_in', $3, $4, 'completed')`, [reciever.id, sender.id, amount, newRecieverBalance]
        );

        await client.query('COMMIT');

        return {
            newSenderBalance, newRecieverBalance,
            senderId: sender.id,
            senderUserId: sender.user_id,
            senderAccountNumber: sender.account_number,
            recieverId: reciever.id,
            recieverUserId: reciever.user_id,
            recieverAccountNumber: reciever.account_number,
        };

    } catch (err) {
        await client.query('ROLLBACK'); // undo verything if ANY step failed
        throw err;
    } finally {
        client.release(); //always return the connection to the pool
    }
}

module.exports = { createAccount, findAccountsByUserId, findAccountById, transferFunds };