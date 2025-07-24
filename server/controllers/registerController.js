import bcrypt from "bcryptjs";
import db from "../models/database/authQueries.js";

async function registerUser(req, res) {
    const { username, email, password } = req.body; 

    if (!username || !email || !password) {
        return res.status(400).json({ field: "all", message : 'Username and password are required.'});
    }

    const checkConflictRows = await db.checkDuplicateUser(username, email);

    if (checkConflictRows.length >= 1) {
        if (checkConflictRows.some(u => u.username === username)) {
            return res.status(409).json({ field: "username", message: 'Username already taken.' });
        }

        if (checkConflictRows.some(u => u.email === email)) {
            return res.status(409).json({ field: "email", message: 'Email already registered.' });
        }
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.registerUser(username, email, hashedPassword); 
        res.status(201).json({'success': `New user ${username} created`});

    } catch (err) {
        res.status(500).json({'message': err.message});
    } 
}

export { registerUser }