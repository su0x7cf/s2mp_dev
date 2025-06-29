const requireLogin = (req, res, next) => {
    //extract token from cookies
    const token = req.cookies.token;
    //if no token, return unauthorized
    if(!token){
        return res.status(401).json({message: "Unauthorized"});
    }
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //if token is invalid, return unauthorized
    if(!decoded){
        return res.status(401).json({message: "Unauthorized"});
    }
}
