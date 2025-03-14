require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users')
const taskRoutes = require('./routes/tasks')
const projectRoutes = require('./routes/projects')

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
app.use('/api/projects', projectRoutes)

console.log('Mongo URI:', process.env.MONGO_URI);
console.log('Port:', process.env.PORT);


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

