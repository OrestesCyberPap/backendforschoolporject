const db = require('../config/db');

exports.getShows = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { theatreId, title } = req.query;
        
        let query = `
            SELECT s.*, t.name as theatre_name 
            FROM shows s 
            JOIN theatres t ON s.theatre_id = t.theatre_id
            WHERE 1=1
        `;
        let params = [];

        if (theatreId) {
            query += ' AND s.theatre_id = ?';
            params.push(theatreId);
        }
        if (title) {
            query += ' AND s.title LIKE ?';
            params.push(`%${title}%`);
        }
        
        const shows = await conn.query(query, params);
        res.json(shows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        if (conn) conn.release();
    }
};

exports.getShowtimes = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const { showId } = req.params;
        
        const showtimes = await conn.query(
            'SELECT * FROM showtimes WHERE show_id = ? ORDER BY date_time ASC',
            [showId]
        );
        res.json(showtimes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        if (conn) conn.release();
    }
};
