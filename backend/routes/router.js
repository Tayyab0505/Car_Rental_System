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

// User booking routes
router.post('/booking', verifyToken, bookingController.createBooking)
router.delete('/cancelBooking/:id', verifyToken, bookingController.cancelBooking)
router.get('/myBookings', verifyToken, bookingController.getMyBookings)
router.get('/getByID/:id', verifyToken, bookingController.getById)

// Admin booking routes
router.put('/updateBooking/:id', verifyToken, verifyAdmin, bookingController.updateBooking)
router.put('/bookings/:id/confirm', verifyToken, verifyAdmin, bookingController.confirmBooking)
router.get('/getAllBooking', verifyToken, verifyAdmin, bookingController.getAll)
router.get('/getBookingsByUser/:id', verifyToken, verifyAdmin, bookingController.getByUserId)

module.exports = router