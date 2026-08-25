const pool = require('../config/db');

async function generateAccountNumber() {
    let accountNumber;
    let exists = true;

    // Keep generating until we find one that isn't already taken
    while (exists) {
        // Random 10 digit number, always starting with a non-zero digit
        accountNumber = String(Math.floor(1000000000 + Math.random() * 9000000000));

        const result = await pool.query(
            'SELECT id FROM accounts WHERE account_number = $1', [accountNumber]
        );
        exists = result.rows.length > 0;
    }

    return accountNumber;
}

module.exports = generateAccountNumber;