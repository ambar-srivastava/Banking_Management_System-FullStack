const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    // Tokens are sent in the format: "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access token required" })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" })
        }

        // Attach the decoded payload to the request so later handlers can use it.
        req.user = decoded; //{userId, role}
        next(); // proceed to te ctual route handler
    });
}

module.exports = authenticateToken;