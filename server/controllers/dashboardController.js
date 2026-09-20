const { getAdminDashboard, getCustomerDashboard, getEmployeeDashboard } = require('../models/dashboardModel');

async function getDashboard(req, res) {
    try {
        const { userId, role } = req.user;

        let data;
        if (role === 'customer') {
            data = await getCustomerDashboard(userId);
        } else if (role === 'employee') {
            data = await getEmployeeDashboard();
        } else if (role === 'admin') {
            data = await getAdminDashboard();
        } else {
            return res.status(403).json({ error: 'Unknown role' });
        }

        res.json({ role, dashboard: data });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not load dashboard' });
    }
}

module.exports = { getDashboard };