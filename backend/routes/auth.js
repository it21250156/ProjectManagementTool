const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const router = express.Router();

// In-memory store for logged-in users (for demo only)
global.loggedInUsers = global.loggedInUsers || [];

const adminEmail = 'admin@gmail.com';
const adminPassword = 'Admin@1234';

// Register new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (email === adminEmail && password === adminPassword) {
        const token = jwt.sign({ email: adminEmail, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '5h' });
        if (!global.loggedInUsers.includes(adminEmail)) global.loggedInUsers.push(adminEmail);
        return res.json({ token });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id, email: user.email, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Add to logged-in users
        if (!global.loggedInUsers.includes(user.email)) global.loggedInUsers.push(user.email);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout user (optional endpoint)
router.post('/logout', (req, res) => {
    const { email } = req.body;
    global.loggedInUsers = global.loggedInUsers.filter(e => e !== email);
    res.json({ message: 'Logged out' });
});

module.exports = router;