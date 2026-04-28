const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    let conn;
    try {
        conn = await db.getConnection();
        
        // Check if user exists
        const existingUser = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const result = await conn.query(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        if (conn) conn.release();
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    let conn;
    try {
        conn = await db.getConnection();
        
        // Check for user
        const users = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        
        const user = users[0];

        // Match password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Return JWT
        const payload = {
            user: {
                id: Number(user.user_id)
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '10h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        if (conn) conn.release();
    }
};
