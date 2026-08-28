require('dotenv').config();

// ---- Core dependencies ----
const express = require('express');
const cors = require('cors');

// ---- Local modules ----
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
// const authenticateToken = require('./middleware/authMiddleware');
const accountRoutes = require('./routes/accountRoutes');
const loanRoutes = require('./routes/loanRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// ---- App setup ----
const app = express();
app.use(express.json());
app.use(cors());

// ---- Routes ----
app.get('/', (req, res) => {
    res.json({ message: 'Banking Management System API is running' });
});

app.use('/api/auth', authRoutes);

// app.get('/api/profile', authenticateToken, (req, res) => {
//     res.json({ message: 'You are authenticated', user: req.user });
// });

app.use('/api/accounts', accountRoutes);

app.use('/api/loans', loanRoutes);

app.use('/api/dashboard', dashboardRoutes);

// ---- Start server ----
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});