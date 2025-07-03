const jwt = require("jsonwebtoken");

const requireLogin = (req, res, next) => {
    // Try to get token from Authorization header (Bearer) or cookies
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = requireLogin;
