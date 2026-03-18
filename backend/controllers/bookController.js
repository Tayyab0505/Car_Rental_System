const bookingService = require("../services/bookService");

const createBooking = async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(400).json({
                message: "Only users can book cars",
            });
        }

        const userId = req.user.id;

        const result = await bookingService.createBooking({
            userId,
            carId: req.body.carId,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        });

        return res.status(201).json({
            message: "Booking created successfully",
            booking: result
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await bookingService.updateBooking(id, req.body);
        res.status(200).json({ message: "Booking updated successfully", booking });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const confirmBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;

        const result = await bookingService.confirmBooking(bookingId);

        if (!result.success) {
            return res.status(400).json({
                status: 400,
                message: result.message
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Booking confirmed successfully",
            data: result.booking
        });
    } catch (error) {
        console.error("Confirm Booking Error:", error);
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await bookingService.cancelBooking(id);
        res.status(200).json({ message: "Booking cancelled successfully", booking });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const bookings = await bookingService.getAllBookings();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await bookingService.getBookingById(id);
        res.status(200).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

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
    getByUserId
};