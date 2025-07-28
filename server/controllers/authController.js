import bcrypt from "bcryptjs";
import db from "../models/database/authQueries.js";
import jwt from "jsonwebtoken";

async function loginUser(req, res) {

    const { username, password } = req.body;

    //Replaced with validateRequest 
    /*if (!username || !password) {
        return res.status(400).json({'message': 'Username and password are required.'});
    }*/

    const findUserRows = await db.findUserFromUsername(username);

    if (findUserRows.length !== 1) {
        return res.status(401).json({'message': 'Invalid user credentials'});
    }

    const foundUser = findUserRows[0];

    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {

        //create JWT 
        const accessToken = jwt.sign(
            { "userId": foundUser.user_id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { "userId": foundUser.user_id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );
        //TODO: extend length of refreshToken by storing in db too
        
        //add Secure: process.env.NODE_ENV ==='production'? when in production 
        res.cookie('jwt', refreshToken, {
            httpOnly: true, 
            sameSite: "Strict",
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({accessToken});

    } else {
        return res.status(401).json({'message': 'Invalid user credentials'});
    }
}

export { loginUser };