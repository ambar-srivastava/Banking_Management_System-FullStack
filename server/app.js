require('dotenv').config();

const validateEnv = require('./utils/validateEnv')

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/authRoutes')
const accountRoutes = require('./routes/accountRoutes')
const loanRoutes = require('./routes/loanRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

const app = express();

// Middlewares
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(generalLimiter)

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Banking Management System API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/accounts', accountRoutes)
app.use('/api/loans', loanRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' })
})

// Error Handling
app.use(errorHandler)

module.exports = app