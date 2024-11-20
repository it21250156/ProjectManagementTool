const express = require('express');

const router = express.Router();

// get all users
router.get('/', (req, res) => {
    res.json({mssg: 'GET all users'})
})

// get single user
router.get('/:id', (req, res) => {
    res.json({mssg: 'GET a single user'})
})

// post a user
router.post('/add', (req, res) => {
    res.json({mssg: 'POST a user'})
})

// delete a user
router.delete('/delete/:id', (req, res) => {
    res.json({mssg: 'DELETE a user'})
})

// update a user
router.patch('/update/:id', (req, res) => {
    res.json({mssg: 'UPDATE a user'})
})

module.exports = router