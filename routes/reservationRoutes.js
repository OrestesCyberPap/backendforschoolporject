const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, reservationController.createReservation);
router.get('/user', auth, reservationController.getUserReservations);
router.delete('/:id', auth, reservationController.cancelReservation);

module.exports = router;
