const { createLoan, findLoansByUserId, findLoanById, reviewLoan, findPendingLoans } = require('../models/loanModel');

const { calculateEMI } = require('../utils/loanCalculator');

const { findAccountById } = require('../models/accountModel');
const { getMyAccount } = require('./accountController');

async function applyForLoan(req, res) {
    try {
        const { accountId, principal, annualInterestRate, termMonths } = req.body;
        const userId = req.user.userId;

        if (!accountId || !principal || !annualInterestRate || !termMonths) {
            return res.status(400).json({
                error: 'All loan fields are required'
            });
        }

        if (principal <= 0 || termMonths <= 0) {
            return res.status(400).json({
                error: "principal and termMonths must be positive"
            });
        }

        // Ownership check, same pattern as before
        const account = await findAccountById(accountId);
        if (!account || account.user_id !== userId) {
            return res.status(403).json({ error: 'You do not own this account' });
        }

        const emiAmount = calculateEMI(principal, annualInterestRate, termMonths);
        const loan = await createLoan(userId, accountId, principal, annualInterestRate, termMonths, emiAmount);

        res.status(201).json({ message: 'Loan application submitted', loan });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not submit loan application' });
    }
}

async function getMyLoans(req, res) {
    try {
        const loans = await findLoansByUserId(req.user.userId);
        res.json({ loans });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch your loans' });
    }
}

// ---Employee-only actions below ---

async function getPendingLoans(req, res) {
    try {
        const loans = await findPendingLoans();
        res.json({ loans });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Could not fetch pending loans'
        });
    }
}

async function decideLoan(req, res) {
    try {
        const { loanId } = req.params;
        const { decision } = req.body; // 'approved' or 'rejected'
        const reviewerId = req.user.userId;

        if (!['approved', 'rejected'].includes(decision)) {
            return res.status(400).json({ error: "decision must be 'approved' or 'rejected'" });
        }

        const loan = await reviewLoan(loanId, decision, reviewerId);
        if (!loan) {
            return res.status(404).json({
                error: 'Loan not found or already reviewed'
            });
        }

        res.json({ message: `Loan ${decision}`, loan });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not review loan' });
    }
}

module.exports = { applyForLoan, getMyLoans, getPendingLoans, decideLoan };