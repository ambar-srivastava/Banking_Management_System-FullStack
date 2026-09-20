const QRCode = require('qrcode')

async function generateTwoFactorSecret(email) {
    const { generateSecret, generateURI } = await import('otplib')

    const secret = generateSecret();
    const uri = generateURI({
        issuer: 'Banking Management System',
        label: email,
        secret,
    })
    const qrCode = await QRCode.toDataURL(uri);

    return {
        secret, qrCode
    }
}

async function varifyTwoFactorToken(secret, token) {
    const { verify } = await import('otplib')
    const result = await verify({ secret, token })
    return result.valid;
}

module.exports = {
    generateTwoFactorSecret, varifyTwoFactorToken
}