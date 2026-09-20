const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { findUserByEmail, createUser } = require('../models/userModel')
const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/AppError')

const register = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
        throw new AppError('All fields are required', 400)
    }
    if (password.length < 8) {
        throw new AppError('Password must be at least 8 characters', 400)
    }

    const existingUser = await findUserByEmail(email)
    if (existingUser) {
        throw new AppError('Email already registered', 409)
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = await createUser(fullName, email, passwordHash)

    res.status(201).json({ message: 'User registered successfully', user: newUser })
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new AppError('Email and password are required', 400)
    }

    const user = await findUserByEmail(email)
    if (!user) {
        throw new AppError('Invalid email or password', 401)
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatches) {
        throw new AppError('Invalid email or password', 401)
    }

    if (user.two_factor_enabled) {
        const preAuthToken = jwt.sign(
            { userId: user.id, stage: 'pre-2fa' },
            process.env.JWT_SECRET,
            { expiresIn: '5m' }
        )
        return res.json({ requires2FA: true, preAuthToken })
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, fullName: user.full_name, email: user.email, role: user.role },
    })
})

module.exports = { register, login }