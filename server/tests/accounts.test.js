require('dotenv').config({ path: '.env.test', override: true });
process.env.DB_NAME = 'banking_system_test';

const request = require('supertest')
const app = require('../app')
const pool = require('../config/db')
const { createTestUser, createTestAccount, setAccountBalance } = require('./testHelpers')

let senderToken, receiverToken, senderAccount, receiverAccount

beforeAll(async () => {
    senderToken = await createTestUser(app, 'jest.sender@example.com')
    receiverToken = await createTestUser(app, 'jest.receiver@example.com')

    senderAccount = await createTestAccount(app, senderToken)
    receiverAccount = await createTestAccount(app, receiverToken)

    await setAccountBalance(senderAccount.id, 1000)
})

afterAll(async () => {
    await pool.query('DELETE FROM transactions WHERE account_id IN ($1, $2)', [senderAccount.id, receiverAccount.id])
    await pool.query('DELETE FROM accounts WHERE id IN ($1, $2)', [senderAccount.id, receiverAccount.id])
    await pool.query('DELETE FROM users WHERE email IN ($1, $2)', ['jest.sender@example.com', 'jest.receiver@example.com'])
    await pool.end()
})

describe('GET /api/acounts', () => {
    it("only returns the logged-in user's own accounts", async () => {
        const res = await request(app)
            .get('/api/accounts')
            .set('Authorization', `Bearer ${senderToken}`)

        expect(res.statusCode).toBe(200)
        expect(res.body.accounts.every((acc) => acc.id !== receiverAccount.id)).toBe(true)
    })

    it("rejects requests with no token", async () => {
        const res = await request(app).get('/api/accounts')
        expect(res.statusCode).toBe(401)
    })
})

describe('POST /api/accounts/transfer', () => {
    it('transfers funds and updates both balances correctly', async () => {
        const res = await request(app)
            .post('/api/accounts/transfer')
            .set('Authorization', `Bearer ${senderToken}`)
            .send({ fromAccountId: senderAccount.id, toAccountNumber: receiverAccount.account_number, amount: 200 })

        expect(res.statusCode).toBe(200)
        expect(parseFloat(res.body.newSenderBalance)).toBe(800)
        expect(parseFloat(res.body.newReceiverBalance)).toBe(200)
    })

    it("rejects a transfer for more than the available balance and leaves balances unchanged", async () => {
        const before = await pool.query('SELECT balance FROM accounts WHERE id = $1', [senderAccount.id])

        const res = await request(app)
            .post('/api/accounts/transfer')
            .set('Authorization', `Bearer ${senderToken}`)
            .send({
                fromAccountId: senderAccount.id,
                toAccountNumber: receiverAccount.account_number,
                amount: 999999
            })

        expect(res.statusCode).toBe(400)
        expect(res.body.error).toBe('Insufficient funds')

        const after = await pool.query('SELECT balance FROM accounts WHERE id = $1', [senderAccount.id])
        expect(after.rows[0].balance).toBe(before.rows[0].balance)
    })

    it("rejects transferring from an account the caller dosen't own", async () => {
        const res = await request(app)
            .post('/api/accounts/transfer')
            .set('Authorization', `Bearer ${receiverToken}`)
            .send({
                fromAccountId: senderAccount.id,
                toAccountNumber: receiverAccount.account_number,
                amount: 10
            })

        expect(res.statusCode).toBe(403)
    })

    it("prevents overdraw when two transfers race on the same account (row locking)", async () => {
        // Balance is 800 after the first test. Two concurrent transfers of 500 each —
        // without row locking, both could read "800 available" before either commits.

        const [res1, res2] = await Promise.all([
            request(app)
                .post('/api/accounts/transfer')
                .set('Authorization', `Bearer ${senderToken}`)
                .send({
                    fromAccountId: senderAccount.id,
                    toAccountNumber: receiverAccount.account_number,
                    amount: 500
                }),
            request(app)
                .post('/api/accounts/transfer')
                .set('Authorization', `Bearer ${senderToken}`)
                .send({
                    fromAccountId: senderAccount.id,
                    toAccountNumber: receiverAccount.account_number,
                    amount: 500
                }),
        ])

        const statusCode = [res1.statusCode, res2.statusCode].sort()
        expect(statusCode).toEqual([200, 400])

        const finalBalance = await pool.query('SELECT balance FROM accounts WHERE id = $1', [senderAccount.id])
        expect(parseFloat(finalBalance.rows[0].balance)).toBe(300)
    })
})