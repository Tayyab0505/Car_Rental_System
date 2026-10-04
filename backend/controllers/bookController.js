const bookingService = require('../services/bookService')

const createBooking = async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({
                message: 'Only users can book cars'
            })
        }

        const booking = await bookingService.createBooking({
            userId: req.user.id,
            carId: req.body.carId,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        })

        return res.status(201).json({
            message: 'Booking created successfully',
            booking
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const updateBooking = async (req, res) => {
    try {
        const booking = await bookingService.updateBooking(
            req.params.id,
            req.body
        )

        return res.status(200).json({
            message: 'Booking updated successfully',
            booking
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const confirmBooking = async (req, res) => {
    try {
        const result = await bookingService.confirmBooking(req.params.id)

        if (!result.success) {
            return res.status(400).json({
                message: result.message
            })
        }

        return res.status(200).json({
            message: 'Booking confirmed successfully',
            booking: result.booking
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const cancelBooking = async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({
                message: 'Only users can cancel their bookings'
            })
        }

        const booking = await bookingService.cancelBooking(
            req.params.id,
            req.user.id
        )

        return res.status(200).json({
            message: 'Booking cancelled successfully',
            booking
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const getAll = async (req, res) => {
    try {
        const bookings = await bookingService.getAllBookings()

        return res.status(200).json(bookings)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const getById = async (req, res) => {
    try {
        const booking = await bookingService.getBookingById(req.params.id)

        if (
            req.user.role !== 'admin' &&
            Number(booking.userId) !== Number(req.user.id)
        ) {
            return res.status(403).json({ message: 'You are not allowed to view this booking' })
        }

        return res.status(200).json(booking)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const getMyBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getByUserId(req.user.id)

        return res.status(200).json(bookings)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

const getByUserId = async (req, res) => {
    try {
        const bookings = await bookingService.getByUserId(req.params.id)

        return res.status(200).json(bookings)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

module.exports = {
    createBooking,
    updateBooking,
    confirmBooking,
    cancelBooking,
    getAll,
    getById,
    getMyBookings,
    getByUserId
}