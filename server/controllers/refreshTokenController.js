import jwt from "jsonwebtoken";

async function refreshToken(req, res) {
    const token = req.cookies.jwt; 

    if (!token) {
        return res.status(401).json({message: 'Refresh token missing'});
    }

        //TODO: Store refresh token in DB, verify that it also exists in DB

    try { 
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  

        //create JWT 
        const accessToken = jwt.sign(
            { "userId": decoded.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        res.json({accessToken});

    } catch (err) {
        res.status(401).json({message: 'Invalid or expired refresh token'});
    }

}

export { refreshToken };