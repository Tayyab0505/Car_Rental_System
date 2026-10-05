const express = require('express')
const router = express.Router()

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware')
const { uploadCarImages } = require('../middleware/uploadMiddleware')

// User Routes
const userController = require('../controllers/userController')

router.post('/register', userController.register)
router.post('/login', userController.login)

// Car Routes
const carController = require('../controllers/carController')

router.post('/addCar', verifyToken, verifyAdmin, uploadCarImages, carController.addCar)
router.put('/updateCar/:id', verifyToken, verifyAdmin, uploadCarImages, carController.updateCar)
router.get('/findAllCar', carController.findAllCar)
router.get('/findAllAdminCars', verifyToken, verifyAdmin, carController.findAllAdminCars)
router.get('/findByIdCar/:id', carController.findById)
router.delete('/deleteCar/:id', verifyToken, verifyAdmin, carController.deleteCar)

// Booking Routes
const bookingController = require('../controllers/bookController')

router.post('/booking', verifyToken, bookingController.createBooking)
router.put('/updateBooking/:id', verifyToken, verifyAdmin, bookingController.updateBooking)
router.put('/bookings/:id/confirm', verifyToken, verifyAdmin, bookingController.confirmBooking)
router.delete('/cancelBooking/:id', verifyToken, bookingController.cancelBooking)
router.get('/myBookings', verifyToken, bookingController.getMyBookings)
router.get('/getAllBooking', verifyToken, verifyAdmin, bookingController.getAll)
router.get('/getByID/:id', verifyToken, bookingController.getById)
router.get('/getBookingsByUser/:id', verifyToken, verifyAdmin, bookingController.getByUserId)

module.exports = router