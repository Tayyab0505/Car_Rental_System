const express = require('express')
const router = express.Router()

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware')

const userController = require('../controllers/userController')
const carController = require('../controllers/carController')
const bookingController = require('../controllers/bookController')

// User routes
router.post('/register', userController.register)
router.post('/login', userController.login)

// Public car routes
router.get('/findAllCar', carController.findAllCar)
router.get('/findByIdCar/:id', carController.findById)

// Admin car routes
router.post('/addCar', verifyToken, verifyAdmin, carController.addCar)
router.put('/updateCar/:id', verifyToken, verifyAdmin, carController.updateCar)
router.delete('/deleteCar/:id', verifyToken, verifyAdmin, carController.deleteCar)

// Booking routes
router.post('/booking', verifyToken, bookingController.createBooking)
router.put('/updateBooking/:id', verifyToken, bookingController.updateBooking)
router.delete('/cancelBooking/:id', verifyToken, bookingController.cancelBooking)
router.get('/getByID/:id', verifyToken, bookingController.getById)
router.get('/getBookingsByUser/:id', verifyToken, bookingController.getByUserId)

// Admin booking routes
router.put('/bookings/:id/confirm', verifyToken, verifyAdmin, bookingController.confirmBooking)
router.get('/getAllBooking', verifyToken, verifyAdmin, bookingController.getAll)

module.exports = router