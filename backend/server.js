require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users')
const taskRoutes = require('./routes/tasks')
const projectRoutes = require('./routes/projects')
const skillRoutes = require('./routes/skills');
const authRoutes = require('./routes/auth');
const cors = require('cors');

// express app
const app = express();

app.use(cors());
app.use(express.json());

// middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next();
})

// routes
app.use('/api/user', userRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/skills', skillRoutes);

console.log('Mongo URI:', process.env.MONGO_URI);
console.log('Port:', process.env.PORT);

// ✅ Alias for `/api/user` (Fix 404 Issue)
app.use('/api/user', userRoutes); // Allow both `/api/users` and `/api/user`


// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('Connected to DB & Server is running on port 4080');
        })
    })
    .catch((error) => {
        console.log(error)
    })

