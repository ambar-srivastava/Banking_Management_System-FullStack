const { createAccount, findAccountsByUserId, findAccountById, transferFunds } = require('../models/accountModel');
const generateAccountNumber = require('../utils/generateAccountNumber');
const { getTransactionHistory, getStatementData } = require('../models/transactionModel');
const generateStatementPDF = require('../utils/generateStatementPDF');

const { getIO } = require('../socket');

const ALLOWED_TYPES = ['savings', 'checking'];

async function openAccount(req, res) {
    try {
        const { accountType } = req.body;
        const userId = req.user.userId; //comes from the JWT, not from the request body

        if (!ALLOWED_TYPES.includes(accountType)) {
            return res.status(400).json({
                error: `Account Type must be one of: ${ALLOWED_TYPES.join(', ')}`
            })
        }

        const accountNumber = await generateAccountNumber();
        const account = await createAccount(userId, accountNumber, accountType);

        res.status(201).json({ message: 'Account created', account });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Could not create a new account'
        });
    }
}

async function getMyAccount(req, res) {
    try {
        const userId = req.user.userId;
        const accounts = await findAccountsByUserId(userId);
        res.json({ accounts });
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Could not fetch accounts" });
    }
}

async function transfer(req, res) {
    try {
        const { fromAccountId, toAccountNumber, amount } = req.body;
        const userId = req.user.userId;

        if (!fromAccountId || !toAccountNumber || !amount) {
            return res.status(400).json({ error: 'fromAccountId, toAccountNumber, and amount are required' })
        }
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: 'amount must be a positive number' })
        }

        // Ownership check: does this account actully belong to the logged-in user?
        const account = await findAccountById(fromAccountId);
        if (!account || account.user_id !== userId) {
            return res.status(403).json({ error: 'You do not own this account' });
        }

        const result = await transferFunds(fromAccountId, toAccountNumber, amount);

        const io = getIO();
        if (io) {
            io.to(`user:${result.senderUserId}`).emit('transaction:new', {
                accountId: result.senderId,
                accountNumber: result.senderAccountNumber,
                type: 'transfer_out',
                amount,
                balance: result.newSenderBalance,
            })
            io.to(`user:${result.recieverUserId}`).emit('transaction:new', {
                accountId: result.recieverId,
                accountNumber: result.recieverAccountNumber,
                type: 'transfer_in',
                balance: result.newRecieverBalance,
            })
        }

        res.json({ message: 'Transfer successful', ...result });

    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ error: err.message });
        }
        console.error(err);
        res.status(500).json({ error: 'Transfer failed' });
    }
}

async function getHistory(req, res) {
    try {
        const { accountId } = req.params;
        const userId = req.user.userId;

        //Ownership check - same pattern as the transfer route
        const account = await findAccountById(accountId);
        if (!account || account.user_id !== userId) {
            return res.status(403).json({ error: "You do not own this account" });
        }

        const { type, startDate, endDate, minAmount, maxAmount, page, limit } = req.query;

        const parsedPage = page ? parseInt(page, 10) : undefined;
        const parsedLimit = limit ? parseInt(limit, 10) : undefined;

        const result = await getTransactionHistory(accountId, {
            type, startDate, endDate, minAmount, maxAmount, page: parsedPage, limit: parsedLimit
        });

        res.json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Could not fetch transaction history'
        })
    }
}

async function downloadStatement(req, res) {
    try {
        const { accountId } = req.params;
        const { startDate, endDate } = req.query;
        const userId = req.user.userId;

        if (!startDate || !endDate) {
            return res.status(400).json({
                error: "Start Date and End Date are required"
            });
        }

        const account = await findAccountById(accountId);
        if (!account || account.user_id !== userId) {
            return res.status(403).json({
                error: "You do not own this account"
            });
        }

        const statementData = await getStatementData(accountId, startDate, endDate);
        generateStatementPDF(res, account, statementData, startDate, endDate);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Could not generate statement"
        });
    }
}

module.exports = { openAccount, getMyAccount, transfer, getHistory, downloadStatement };