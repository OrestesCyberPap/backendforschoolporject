const db = require('./config/db');

async function addShows() {
    let conn;
    try {
        conn = await db.getConnection();
        
        // Add more theatres
        await conn.query(`INSERT INTO theatres (name, location, description) VALUES 
        ('Ηρώδειο', 'Διονυσίου Αρεοπαγίτου, Αθήνα', 'Αρχαίο ωδείο κάτω από την Ακρόπολη.'),
        ('Θέατρο Τέχνης', 'Πεσμαζόγλου 5, Αθήνα', 'Ιστορικό θέατρο στο κέντρο της πόλης.');`);

        // Add shows
        const shows = [
            { theatre_id: 3, title: 'Το Σπίτι της Μπερνάρντα Άλμπα', description: 'Δράμα του Φεντερίκο Γκαρθία Λόρκα', duration: 110, age_rating: '15+' },
            { theatre_id: 4, title: 'Ο Θάνατος του Εμποράκου', description: 'Κλασικό έργο του Άρθουρ Μίλερ', duration: 130, age_rating: '12+' },
            { theatre_id: 1, title: 'Οι Μάγισσες του Σάλεμ', description: 'Έργο του Άρθουρ Μίλερ', duration: 140, age_rating: '15+' },
            { theatre_id: 2, title: 'Λεωφορείον ο Πόθος', description: 'Αριστούργημα του Τένεσι Ουίλιαμς', duration: 125, age_rating: '15+' },
            { theatre_id: 4, title: 'Ο Γυάλινος Κόσμος', description: 'Του Τένεσι Ουίλιαμς', duration: 115, age_rating: '12+' },
            { theatre_id: 1, title: 'Θείος Βάνιας', description: 'Άντον Τσέχωφ', duration: 150, age_rating: 'All' },
            { theatre_id: 4, title: 'Ο Γλάρος', description: 'Άντον Τσέχωφ', duration: 130, age_rating: 'All' },
            { theatre_id: 3, title: 'Μήδεια', description: 'Τραγωδία του Ευριπίδη', duration: 100, age_rating: '12+' },
            { theatre_id: 3, title: 'Λυσιστράτη', description: 'Κωμωδία του Αριστοφάνη', duration: 90, age_rating: '15+' },
            { theatre_id: 3, title: 'Θεσμοφοριάζουσες', description: 'Κωμωδία του Αριστοφάνη', duration: 95, age_rating: '15+' },
            { theatre_id: 2, title: 'Οι Άθλιοι', description: 'Επικό Μιούζικαλ', duration: 180, age_rating: 'All' },
            { theatre_id: 2, title: 'Σικάγο', description: 'Διάσημο Μιούζικαλ', duration: 140, age_rating: '15+' }
        ];

        for (const show of shows) {
            const res = await conn.query(
                'INSERT INTO shows (theatre_id, title, description, duration, age_rating) VALUES (?, ?, ?, ?, ?)',
                [show.theatre_id, show.title, show.description, show.duration, show.age_rating]
            );
            const showId = Number(res.insertId);
            
            // Add 2 showtimes for each show
            await conn.query(
                'INSERT INTO showtimes (show_id, date_time, price) VALUES (?, ?, ?), (?, ?, ?)',
                [
                    showId, '2026-06-20 21:00:00', 20.00,
                    showId, '2026-06-21 21:00:00', 20.00
                ]
            );
        }

        console.log('Successfully added all shows and showtimes!');
    } catch (err) {
        console.error('Error adding shows:', err);
    } finally {
        if (conn) conn.release();
        process.exit();
    }
}

addShows();
