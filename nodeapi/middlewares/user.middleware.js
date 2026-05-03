const { getById } = require("../services/users.service");
const { verifyToken } = require("../utils/jwt.utils");

const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const splittedHeader = authHeader.split(' ');
    if (splittedHeader.length !== 2 || splittedHeader[0] !== 'Bearer') {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = splittedHeader[1];
    const payload = verifyToken(token);
    if (!payload) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (payload.id === undefined) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await getById(payload.id);
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
};

module.exports = requireAuth;