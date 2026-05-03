module.exports = {
    generateToken: (payload) => {
        const jwt = require('jsonwebtoken');
        const secretKey = process.env.JWT_SECRET;
        console.log(secretKey);
        const token = jwt.sign(payload, secretKey, { expiresIn: '30m' });
        return token;
    },
    verifyToken: (token) => {
        const jwt = require('jsonwebtoken');
        const secretKey = process.env.JWT_SECRET;
        try {
            const decoded = jwt.verify(token, secretKey);
            return decoded;
        } catch (err) {
            return null;
        }
    }
}