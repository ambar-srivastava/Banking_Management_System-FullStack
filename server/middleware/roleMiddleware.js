function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        // req.user was se by authenticateToken, which must run before this

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'You do not have permission to perform this action' });
        }
        next();
    };
}

module.exports = authorizeRoles;