// const User = require('../models/userModel')
// const jwt = require('jsonwebtoken')

// const createToken = (_id) => {
//     return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
// }

// // login user
// const loginUser = async (req, res) => {

//     const {email, password} = req.body

//     if (!email ||!password) {
//         return res.status(400).json({ error: "Email and password are required" });
//     }

//     try {
//         const user = await User.login(email, password)

//         // create token
//         const token = createToken(user._id)

//         res.status(200).json({email, token})

//     } catch (error) {
//         res.status(400).json({error: error.message})
//     }

// }

// // sign up user
// const signupUser = async (req, res) => {

//     const {name, email, password} = req.body

//     if (!name || !email || !password) {
//         return res.status(400).json({ error: "Name, email, and password are required" });
//     }

//     try {
//         const user = await User.signup(name, email, password)

//         // create token
//         const token = createToken(user._id)

//         res.status(200).json({email, token})

//     } catch (error) {
//         res.status(400).json({error: error.message})
//     }
// }

// module.exports = {signupUser, loginUser}