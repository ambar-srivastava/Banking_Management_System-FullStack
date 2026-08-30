function validateEnv() {
    const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_EXPIRES_IN'];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.error(`Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1); // refuse to start rather than run in a broken state
    }
}

module.exports = validateEnv;