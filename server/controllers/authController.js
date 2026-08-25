const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { findUserByEmail, createUser } = require('../models/userModel');

async function registerController(req, res) {
    try {
        const { fullName, email, password } = req.body;

        //1. Basic input vallidation
        if (!fullName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' })
        }
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters" });
        }

        //2. Check if the email is already registered
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: "Email already registered" })
        }

        //3. Hash the Password - Never store it as plain text
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        //4. Create the user
        const newUser = await createUser(fullName, email, passwordHash);

        res.status(201).json({
            message: "User registerd successfully",
            user: newUser
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Somthing went wrong during registration" });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and Password are required" })
        }

        // 1. Find the User

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" })
        }

        // 2. Compares the submitted password against the stored hash

        const passwordMatches = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatches) {
            return res.status(401).json({
                error: "Invalid email or password"
            })
        }

        // 3. Credentials are valid - issue a JWT

        const token = jwt.sign({
            userId: user.id, role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, fullName: user.full_name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Something went wrong during login"
        });
    }
}

module.exports = { registerController, login };