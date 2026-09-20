const pool = require('../config/db');

async function findUserByEmail(email) {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1', [email]
    );
    return result.rows[0];
}

async function createUser(fullName, email, passwordHash, role = 'customer') {
    const result = await pool.query(
        `INSERT INTO users (full_name, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, full_name, email, role, created_at`, [fullName, email, passwordHash, role]
    );
    return result.rows[0];
}

async function findUserById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    return result.rows[0]
}

async function setTempTwoFactorSecret(userId, tempSecret) {
    await pool.query('UPDATE users SET two_factor_temp_secret = $1 WHERE id = $2', [tempSecret, userId])
}

async function enableTwoFactor(userId) {
    await pool.query(
        `UPDATE users
     SET two_factor_enabled = true,
         two_factor_secret = two_factor_temp_secret,
         two_factor_temp_secret = NULL
     WHERE id = $1`,
        [userId]
    )
}

async function disableTwoFactor(userId) {
    await pool.query(
        `UPDATE users
     SET two_factor_enabled = false, two_factor_secret = NULL, two_factor_temp_secret = NULL
     WHERE id = $1`,
        [userId]
    )
}

async function listAllUsers() {
    const result = await pool.query(
        'SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC'
    )
    return result.rows;
}

async function updateUserRoleById(userId, role) {
    const result = await pool.query(
        `UPDATE users SET role = $1 WHERE id =$2 RETURNING id, full_name, email, role, created_at`, [role, userId]
    )
    return result.rows[0];
}

module.exports = { findUserByEmail, createUser, findUserById, setTempTwoFactorSecret, enableTwoFactor, disableTwoFactor, listAllUsers, updateUserRoleById };