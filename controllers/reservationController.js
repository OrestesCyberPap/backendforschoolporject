const db = require('../config/db');

// Create a reservation
exports.createReservation = async (req, res) => {
    const { showtimeId, numberOfTickets } = req.body;
    const userId = req.user.id; 
    let conn;
    
    try {
        conn = await db.getConnection();
        
        const result = await conn.query(
            'INSERT INTO reservations (user_id, showtime_id, number_of_tickets) VALUES (?, ?, ?)',
            [userId, showtimeId, numberOfTickets]
        );
        
        res.status(201).json({ message: 'Reservation created successfully', reservationId: Number(result.insertId) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        if (conn) conn.release();
    }
};

// Get user reservations
exports.getUserReservations = async (req, res) => {
    const userId = req.user.id;
    let conn;
    
    try {
        conn = await db.getConnection();
        const query = `
            SELECT r.reservation_id, r.number_of_tickets, r.created_at,
                   st.date_time, st.price,
                   s.title as show_title,
                   t.name as theatre_name
            FROM reservations r
            JOIN showtimes st ON r.showtime_id = st.showtime_id
            JOIN shows s ON st.show_id = s.show_id
            JOIN theatres t ON s.theatre_id = t.theatre_id
            WHERE r.user_id = ?
            ORDER BY st.date_time DESC
        `;
        const reservations = await conn.query(query, [userId]);
        // Convert BigInts (like reservation_id) to Number for JSON serialization
        const formatted = reservations.map(r => ({
            ...r,
            reservation_id: Number(r.reservation_id),
            price: Number(r.price)
        }));
        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        if (conn) conn.release();
    }
};

// Cancel reservation
exports.cancelReservation = async (req, res) => {
    const userId = req.user.id;
    const reservationId = req.params.id;
    let conn;
    
    try {
        conn = await db.getConnection();
        
        const result = await conn.query(
            'DELETE FROM reservations WHERE reservation_id = ? AND user_id = ?',
            [reservationId, userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reservation not found or unauthorized' });
        }
        
        res.json({ message: 'Reservation cancelled successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        if (conn) conn.release();
    }
};
