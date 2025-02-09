require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users')
const taskRoutes = require('./routes/tasks')

// express app
const app = express();

// middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next();
})

// routes
app.use('/api/user', userRoutes)
app.use('/api/tasks', taskRoutes)

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('Connected to DB & Server is running on port 4000');            
        })
    })
    .catch((error) => {
        console.log(error)
    })

