const request = require('supertest');
const pool = require('../config/db');

async function createTestUser(app, email, password = 'testpass123') {
    await request(app).post('/api/auth/register').send({
        fullName: 'Test User',
        email,
        password
    })
    const loginRes = await request(app).post('/api/auth/login').send({
        email,
        password
    })
    return loginRes.body.token
}

async function createTestAccount(app, token, accountType = 'savings') {
    const res = await request(app)
        .post('/api/accounts')
        .set('Authorization', `Bearer ${token}`)
        .send({ accountType })
    return res.body.account;
}

async function setAccountBalance(accountId, balance) {
    await pool.query('UPDATE accounts SET balance = $1 WHERE id = $2', [balance, accountId]);
}

module.exports = {
    createTestUser, createTestAccount, setAccountBalance
}