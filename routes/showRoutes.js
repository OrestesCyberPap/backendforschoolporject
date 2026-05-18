const express = require('express');
const router = express.Router();
const showController = require('../controllers/showController');

router.get('/', showController.getShows);
router.get('/:showId/showtimes', showController.getShowtimes);
router.get('/showtimes/:showtimeId/seats', showController.getBookedSeats);

module.exports = router;
