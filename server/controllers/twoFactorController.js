const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const {
    findUserById, setTempTwoFactorSecret, enableTwoFactor, disableTwoFactor
} = require('../models/userModel')
const { generateTwoFactorSecret, varifyTwoFactorToken } = require('../utils/twoFactor');

async function setupTwoFactor(req, res) {
    try {
        const user = await findUserById(req.user.userId);
        const { secret, qrCode } = await generateTwoFactorSecret(user.email)
        await setTempTwoFactorSecret(user.id, secret)
        res.json({ qrCode, secret })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            error: 'Could not start 2FA setup'
        })
    }
}

async function verifyTwoFactorSetup(req, res) {
    try {
        const { token } = req.body
        const user = await findUserById(req.user.userId)

        if (!user.two_factor_temp_secret) {
            return res.status(400).json({ error: 'No 2FA setup in progress' })
        }

        const isValid = await verifyTwoFactorToken(user.two_factor_temp_secret, token)
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid code — check your authenticator app and try again' })
        }

        await enableTwoFactor(user.id)
        res.json({ message: '2FA enabled successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Could not verify 2FA setup' })
    }
}

async function disableTwoFactorHandler(req, res) {
    try {
        const { password, token } = req.body
        const user = await findUserById(req.user.userId)

        const passwordMatches = await bcrypt.compare(password, user.password_hash)
        if (!passwordMatches) {
            return res.status(401).json({ error: 'Incorrect password' })
        }

        const isValid = await verifyTwoFactorToken(user.two_factor_secret, token)
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid authentication code' })
        }

        await disableTwoFactor(user.id)
        res.json({ message: '2FA disabled' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Could not disable 2FA' })
    }
}

// Second step of LOGIN — exchanges a valid pre-auth token + TOTP code for a real JWT
async function verifyTwoFactorLogin(req, res) {
    try {
        const { preAuthToken, token } = req.body
        if (!preAuthToken || !token) {
            return res.status(400).json({ error: 'preAuthToken and token are required' })
        }

        let decoded
        try {
            decoded = jwt.verify(preAuthToken, process.env.JWT_SECRET)
        } catch {
            return res.status(401).json({ error: 'Login session expired — please log in again' })
        }
        if (decoded.stage !== 'pre-2fa') {
            return res.status(401).json({ error: 'Invalid session token' })
        }

        const user = await findUserById(decoded.userId)
        const isValid = await verifyTwoFactorToken(user.two_factor_secret, token)
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid authentication code' })
        }

        const fullToken = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        res.json({
            message: 'Login successful',
            token: fullToken,
            user: { id: user.id, fullName: user.full_name, email: user.email, role: user.role },
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Could not verify login' })
    }
}

module.exports = {
    setupTwoFactor, verifyTwoFactorSetup, disableTwoFactorHandler, verifyTwoFactorLogin,
}