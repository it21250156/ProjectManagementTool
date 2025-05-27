require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import route modules
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const projectRoutes = require('./routes/projects');
const skillRoutes = require('./routes/skills');
const teamRoutes = require('./routes/teams');
const geminiRoute = require('./routes/gemini');

// Initialize Express app
const app = express();

// CORS & JSON middleware
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user', userRoutes); // ✅ Alias for backwards compatibility
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/gemini', geminiRoute); // Gemini AI integration route

// Log confirmation of imported route
console.log('✅ geminiRoute imported and mounted.');

// Connection options (force IPv4)
const mongooseOptions = {
    family: 4
};

// MongoDB connection and server start
mongoose.connect(process.env.MONGO_URI, mongooseOptions)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`✅ Connected to DB`);
            console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error.message);
    });
