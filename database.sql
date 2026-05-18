-- Δημιουργία Βάσης Δεδομένων
CREATE DATABASE IF NOT EXISTS theatre_booking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE theatre_booking_db;

-- Πίνακας Χρηστών
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Πίνακας Θεάτρων
CREATE TABLE IF NOT EXISTS theatres (
    theatre_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT
);

-- Πίνακας Παραστάσεων
CREATE TABLE IF NOT EXISTS shows (
    show_id INT AUTO_INCREMENT PRIMARY KEY,
    theatre_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration INT NOT NULL COMMENT 'Duration in minutes',
    age_rating VARCHAR(10),
    FOREIGN KEY (theatre_id) REFERENCES theatres(theatre_id) ON DELETE CASCADE
);

-- Πίνακας Προβολών (Showtimes)
CREATE TABLE IF NOT EXISTS showtimes (
    showtime_id INT AUTO_INCREMENT PRIMARY KEY,
    show_id INT NOT NULL,
    date_time DATETIME NOT NULL,
    price DECIMAL(6, 2) NOT NULL,
    FOREIGN KEY (show_id) REFERENCES shows(show_id) ON DELETE CASCADE
);

-- Πίνακας Κρατήσεων
CREATE TABLE IF NOT EXISTS reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    showtime_id INT NOT NULL,
    number_of_tickets INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id) ON DELETE CASCADE
);

-- Πίνακας Κρατημένων Θέσεων
CREATE TABLE IF NOT EXISTS reserved_seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    seat_label VARCHAR(5) NOT NULL,
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id) ON DELETE CASCADE
);

-- Εισαγωγή Δοκιμαστικών Δεδομένων (Mock Data)
INSERT INTO theatres (name, location, description) VALUES 
('Εθνικό Θέατρο', 'Αγίου Κωνσταντίνου 22, Αθήνα', 'Η πρώτη κρατική σκηνή της χώρας.'),
('Θέατρο Παλλάς', 'Βουκουρεστίου 5, Αθήνα', 'Ένα από τα πιο εμβληματικά θέατρα του κέντρου.'),
('Ηρώδειο', 'Διονυσίου Αρεοπαγίτου, Αθήνα', 'Αρχαίο ωδείο κάτω από την Ακρόπολη.'),
('Θέατρο Τέχνης', 'Πεσμαζόγλου 5, Αθήνα', 'Ιστορικό θέατρο στο κέντρο της πόλης.');

INSERT INTO shows (theatre_id, title, description, duration, age_rating) VALUES 
(1, 'Οιδίπους Τύραννος', 'Κλασική αρχαία τραγωδία του Σοφοκλή.', 120, '12+'),
(2, 'Το Φάντασμα της Όπερας', 'Το διάσημο μιούζικαλ του Andrew Lloyd Webber.', 150, 'All'),
(3, 'Το Σπίτι της Μπερνάρντα Άλμπα', 'Δράμα του Φεντερίκο Γκαρθία Λόρκα', 110, '15+'),
(4, 'Ο Θάνατος του Εμποράκου', 'Κλασικό έργο του Άρθουρ Μίλερ', 130, '12+'),
(1, 'Οι Μάγισσες του Σάλεμ', 'Έργο του Άρθουρ Μίλερ', 140, '15+'),
(2, 'Λεωφορείον ο Πόθος', 'Αριστούργημα του Τένεσι Ουίλιαμς', 125, '15+'),
(4, 'Ο Γυάλινος Κόσμος', 'Του Τένεσι Ουίλιαμς', 115, '12+'),
(1, 'Θείος Βάνιας', 'Άντον Τσέχωφ', 150, 'All'),
(4, 'Ο Γλάρος', 'Άντον Τσέχωφ', 130, 'All'),
(3, 'Μήδεια', 'Τραγωδία του Ευριπίδη', 100, '12+'),
(3, 'Λυσιστράτη', 'Κωμωδία του Αριστοφάνη', 90, '15+'),
(3, 'Θεσμοφοριάζουσες', 'Κωμωδία του Αριστοφάνη', 95, '15+'),
(2, 'Οι Άθλιοι', 'Επικό Μιούζικαλ', 180, 'All'),
(2, 'Σικάγο', 'Διάσημο Μιούζικαλ', 140, '15+');

INSERT INTO showtimes (show_id, date_time, price) VALUES 
(1, '2026-06-10 20:30:00', 15.00),
(1, '2026-06-11 20:30:00', 15.00),
(2, '2026-06-12 21:00:00', 30.00),
(2, '2026-06-13 21:00:00', 35.00),
(3, '2026-06-20 21:00:00', 20.00),
(4, '2026-06-20 21:00:00', 20.00),
(5, '2026-06-20 21:00:00', 20.00),
(6, '2026-06-20 21:00:00', 20.00),
(7, '2026-06-20 21:00:00', 20.00),
(8, '2026-06-20 21:00:00', 20.00),
(9, '2026-06-20 21:00:00', 20.00),
(10, '2026-06-20 21:00:00', 20.00),
(11, '2026-06-20 21:00:00', 20.00),
(12, '2026-06-20 21:00:00', 20.00),
(13, '2026-06-20 21:00:00', 20.00),
(14, '2026-06-20 21:00:00', 20.00);
