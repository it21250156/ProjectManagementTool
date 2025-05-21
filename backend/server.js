require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users')
const taskRoutes = require('./routes/tasks')
const projectRoutes = require('./routes/projects')
const skillRoutes = require('./routes/skills');
const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/teams')
const geminiRoute = require('./routes/gemini');
const cors = require('cors');

// express app
const app = express();

app.use(cors());
app.use(express.json());

// Force IPv4
const mongooseOptions = {
    family: 4, // Force IPv4
};

// middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next();
})

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/skills', skillRoutes);
app.use('/api/teams', teamRoutes);
console.log('geminiRoute export:', geminiRoute);

app.use('/api/gemini', geminiRoute);

console.log('Mongo URI:', process.env.MONGO_URI);
console.log('Port:', process.env.PORT);

// ✅ Alias for `/api/user` (Fix 404 Issue)
app.use('/api/user', userRoutes); // Allow both `/api/users` and `/api/user`


// Connect to MongoDB with IPv4 option
mongoose.connect(process.env.MONGO_URI, mongooseOptions)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Connected to DB & Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB Connection Error:", error.message);
    });
