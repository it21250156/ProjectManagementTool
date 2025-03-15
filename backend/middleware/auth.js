const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Authorization header:', authHeader); // Debugging

  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
  console.log('Extracted token:', token); // Debugging

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debugging
    req.user = decoded; // Attach decoded token data to the request
    next();
  } catch (error) {
    console.error('Token verification error:', error); // Debugging
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = { verifyToken };