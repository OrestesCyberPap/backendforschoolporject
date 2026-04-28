const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Basic test route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Theatre Booking API!' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/theatres', require('./routes/theatreRoutes'));
app.use('/api/shows', require('./routes/showRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
