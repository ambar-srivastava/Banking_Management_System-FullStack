const bcrypt = require('bcrypt');
const { findUserByEmail, createUser, listAllUsers, updateUserRoleById } = require('../models/userModel');

const STAFF_ROLES = ['employee', 'admin'];
const ALL_ROLES = ['customer', 'employee', 'admin'];



// Admin-only: create a brand-new employee or admin account directly.
// Deliberately a separate path from public /auth/register, which only ever creates customers.
async function createStaffUser(req, res) {
    try {
        const { fullName, email, password, role } = req.body;

        if (!fullName || !email || !role) {
            return res.status(400).json({ error: "fullName, email, password, and role are required" })
        }
        if (!STAFF_ROLES.includes(role)) {
            return res.status(400).json({ error: `role must be one of: ${STAFF_ROLES.join(', ')}` })
        }
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters" })
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: "Email already registered" })
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await createUser(fullName, email, passwordHash, role);

        res.status(201).json({ message: `${role} account created`, user: newUser });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not create staff account" });
    }
}

// Employee or admin: view every user in the system
async function getAllUsers(req, res) {
    try {
        const users = await listAllUsers();
        res.json({ users });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not fetch users" });
    }
}

// Admin-only: change any existing user's role
async function updateUserRole(req, res) {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!ALL_ROLES.includes(role)) {
            return res.status(400).json({ error: `role must be one of: ${ALL_ROLES.join(', ')}` })
        }
        if (Number(userId) === req.user.userId) {
            return res.status(400).json({ error: "You cannot change your own role" })
        }
        const updatedUser = await updateUserRoleById(userId, role);
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" })
        }

        res.json({ message: "Role updated successfully", user: updatedUser });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not update user role" });
    }
}

module.exports = {
    createStaffUser, getAllUsers, updateUserRole
}