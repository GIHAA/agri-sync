// gateway/server.js
const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticate = async (req, res, next) => {
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const jwtToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        jwt.verify(jwtToken, 'your_jwt_secret', (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token is not valid' });
            }
            req.user = { id: decoded.id };
            next();
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
    });
});

// // Routes that don't need authentication
// app.use('/auth', proxy('http://user-service:5000', {
//     proxyReqPathResolver: (req) => `/auth${req.url}`
// }));

// // Protected routes
// app.use('/rewards', authenticate, proxy('http://reward-service:5000', {
//     proxyReqPathResolver: (req) => `/rewards${req.url}`
// }));

// app.use('/farming', authenticate, proxy('http://reward-service:5000', {
//     proxyReqPathResolver: (req) => `/farming${req.url}`
// }));

// Routes that don't need authentication
app.use('/auth-service', proxy('http://localhost:3001', {
    proxyReqPathResolver: (req) => `/auth${req.url}`
}));

// Protected routes
app.use('/rewards-service', authenticate, proxy('http://localhost:3003', {
    proxyReqPathResolver: (req) => `/rewards${req.url}`
}));



const PORT = process.env.GATEWAY_PORT || 3000;

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
