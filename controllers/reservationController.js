const db = require('../config/db');

// Create a reservation
exports.createReservation = async (req, res) => {
    const { showtimeId, seats } = req.body;
    const userId = req.user.id; 
    let conn;
    
    try {
        conn = await db.getConnection();
        await conn.beginTransaction();
        
        if (!seats || seats.length === 0) {
            return res.status(400).json({ message: 'No seats provided' });
        }
        
        const numberOfTickets = seats.length;
        const result = await conn.query(
            'INSERT INTO reservations (user_id, showtime_id, number_of_tickets) VALUES (?, ?, ?)',
            [userId, showtimeId, numberOfTickets]
        );
        const reservationId = Number(result.insertId);
        
        const seatValues = seats.map(seat => [reservationId, seat]);
        await conn.batch(
            'INSERT INTO reserved_seats (reservation_id, seat_label) VALUES (?, ?)',
            seatValues
        );
        
        await conn.commit();
        res.status(201).json({ message: 'Reservation created successfully', reservationId });
    } catch (err) {
        if (conn) await conn.rollback();
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
            SELECT r.reservation_id, r.showtime_id, r.number_of_tickets, r.created_at,
                   st.date_time, st.price,
                   s.show_id, s.title as show_title, s.description as show_description, s.duration,
                   t.name as theatre_name,
                   GROUP_CONCAT(rs.seat_label) as seats
            FROM reservations r
            JOIN showtimes st ON r.showtime_id = st.showtime_id
            JOIN shows s ON st.show_id = s.show_id
            JOIN theatres t ON s.theatre_id = t.theatre_id
            LEFT JOIN reserved_seats rs ON r.reservation_id = rs.reservation_id
            WHERE r.user_id = ?
            GROUP BY r.reservation_id
            ORDER BY st.date_time DESC
        `;
        const reservations = await conn.query(query, [userId]);
        // Convert BigInts (like reservation_id) to Number for JSON serialization
        const formatted = reservations.map(r => ({
            ...r,
            reservation_id: Number(r.reservation_id),
            show_id: Number(r.show_id),
            showtime_id: Number(r.showtime_id),
            price: Number(r.price),
            seats: r.seats ? r.seats.split(',') : []
        }));
        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        if (conn) conn.release();
    }
};

// Update reservation (modify seats/showtime)
exports.updateReservation = async (req, res) => {
    const userId = req.user.id;
    const reservationId = req.params.id;
    const { showtimeId, seats } = req.body;
    let conn;
    
    try {
        conn = await db.getConnection();
        await conn.beginTransaction();
        
        // Verify reservation belongs to user
        const existing = await conn.query(
            'SELECT * FROM reservations WHERE reservation_id = ? AND user_id = ?',
            [reservationId, userId]
        );
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Reservation not found or unauthorized' });
        }
        if (!seats || seats.length === 0) {
            return res.status(400).json({ message: 'No seats provided' });
        }
        
        // Update reservation record
        await conn.query(
            'UPDATE reservations SET showtime_id = ?, number_of_tickets = ? WHERE reservation_id = ?',
            [showtimeId, seats.length, reservationId]
        );
        
        // Replace seats: delete old, insert new
        await conn.query('DELETE FROM reserved_seats WHERE reservation_id = ?', [reservationId]);
        const seatValues = seats.map(seat => [reservationId, seat]);
        await conn.batch(
            'INSERT INTO reserved_seats (reservation_id, seat_label) VALUES (?, ?)',
            seatValues
        );
        
        await conn.commit();
        res.json({ message: 'Reservation updated successfully' });
    } catch (err) {
        if (conn) await conn.rollback();
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
