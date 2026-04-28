const db = require('../config/db');

exports.getTheatres = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const theatres = await conn.query('SELECT * FROM theatres');
        res.json(theatres);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        if (conn) conn.release();
    }
};
