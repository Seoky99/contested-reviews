import jwt from "jsonwebtoken"; 

function verifyJWT(req, res, next) {

    const authHeader = req.headers['authorization']; 
    if (!authHeader?.startsWith("Bearer ")) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userId = decoded.userId;
        next();
    } catch (err) {
        //Invalid, tampered with token 
        return res.sendStatus(403);
    }
}

export default verifyJWT;