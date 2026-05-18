const db = require('./config/db');

async function createSeatsTable() {
    let conn;
    try {
        conn = await db.getConnection();
        await conn.query(`
            CREATE TABLE IF NOT EXISTS reserved_seats (
                id INT AUTO_INCREMENT PRIMARY KEY,
                reservation_id INT NOT NULL,
                seat_label VARCHAR(5) NOT NULL,
                FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id) ON DELETE CASCADE
            );
        `);
        console.log('Successfully created reserved_seats table.');
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        if (conn) conn.release();
        process.exit();
    }
}
createSeatsTable();
