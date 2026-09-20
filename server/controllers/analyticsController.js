const { getMonthlyTrend, getSpendingByType, getBalanceTrend } = require("../models/analyticsModel")
const { findAccountById } = require('../models/accountModel')

async function getAnalytics(req, res) {
    try {
        const userId = req.user.userId
        const [monthlyTrend, spendingByType] = await Promise.all([
            getMonthlyTrend(userId, 6),
            getSpendingByType(userId, 6),
        ])
        res.json({ monthlyTrend, spendingByType })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Could not load analytics' })
    }
}

async function getAccountBalanceTrend(req, res) {
    try {
        const { accountId } = req.params
        const userId = req.user.userId

        const account = await findAccountById(accountId)
        if (!account || account.user_id !== userId) {
            return res.status(403).json({
                error: 'You do not own this account'
            })
        }

        const balanceTrend = await getBalanceTrend(accountId)
        res.json({ balanceTrend })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Could not load balance trend' })
    }
}

module.exports = { getAnalytics, getAccountBalanceTrend }