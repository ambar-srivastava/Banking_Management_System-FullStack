require('dotenv').config({ path: '.env.test', override: true });
process.env.DB_NAME = 'banking_system_test';

const request = require('supertest')
const app = require('../app')
const pool = require('../config/db')

afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', ['jest.test@example.com'])
    await pool.end()
})

describe('POST /api/auth/register', () => {
    it('creates a new user with valid data', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ fullName: 'Jest Test', email: 'jest.test@example.com', password: 'testpass123' })

        expect(res.statusCode).toBe(201)
        expect(res.body.user).toHaveProperty('id')
        expect(res.body.user.email).toBe('jest.test@example.com')
        expect(res.body.user).not.toHaveProperty('password_hash')
    })

    it('rejects a duplicate email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ fullName: 'Jest Test', email: 'jest.test@example.com', password: 'testpass123' })

        expect(res.statusCode).toBe(409)
    })

    it('rejects a short password', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ fullName: 'X', email: 'short.pass@example.com', password: '123' })

        expect(res.statusCode).toBe(400)
    })
})

describe('POST /api/auth/login', () => {
    it('logs in with correct credentials and returns a token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'jest.test@example.com', password: 'testpass123' })

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('token')
    })

    it('rejects wrong password with a generic message', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'jest.test@example.com', password: 'wrongpassword' })

        expect(res.statusCode).toBe(401)
        expect(res.body.error).toBe('Invalid email or password')
    })
})