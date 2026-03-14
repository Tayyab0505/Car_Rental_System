const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// User Routes
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);

// Car Routes
const carController = require('../controllers/carController');

router.post('/addCar', verifyToken, verifyAdmin, carController.addCar);
router.put('/updateCar/:id', verifyToken, verifyAdmin, carController.updateCar);
router.get('/findAllCar', verifyToken, carController.findAllCar);
router.get('/findByIdCar/:id', verifyToken, carController.findById);
router.delete('/deleteCar/:id', verifyToken, verifyAdmin, carController.deleteCar);

// Booking Routes
const bookingController = require('../controllers/bookController');

router.post('/booking', verifyToken, bookingController.createBooking);
router.put('/updateBooking/:id', verifyToken, bookingController.updateBooking);
router.put("/bookings/:id/confirm", verifyAdmin, bookingController.confirmBooking);
router.delete('/cancelBooking/:id', verifyToken, bookingController.cancelBooking);
router.get('/getAllBooking', verifyToken, verifyAdmin, bookingController.getAll);
router.get('/getByID/:id', verifyToken, bookingController.getById);


module.exports = router;