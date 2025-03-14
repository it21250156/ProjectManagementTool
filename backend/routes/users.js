const express = require('express')

const { signupUser, loginUser } = require('../controllers/userController')

const router = express.Router()

// login routes
router.post('/login', loginUser)


// sign up routes
router.post('/signup', signupUser)



module.exports = router