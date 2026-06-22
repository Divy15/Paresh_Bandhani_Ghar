// helper/jwttoken.js
const jwt = require('jsonwebtoken');
const config = require('config');

const JWT_SECRET = config.get('App.JWT.Secret');

// Helper 1: Generate absolute Token
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

// Helper 2: Verify, decode, and inject token metadata directly into route cycles
const verifyTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });
    }

    // Capture Bearer <token> split alignment cleanly
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Invalid token structure format' });
    }

    try {
        const decodedData = jwt.verify(token, JWT_SECRET);
        req.user = decodedData; // Store user details globally for the subsequent endpoint controller
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Invalid or Expired Token signature validation' });
    }
};

module.exports = {
    generateToken,
    verifyTokenMiddleware
};