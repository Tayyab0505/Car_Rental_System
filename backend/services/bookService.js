const initModels = require('../models/init-models');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');
const models = initModels(sequelize);

const Booking = models.booking;
const User = models.user;
const Car = models.car;

const createBooking = async (data) => {
    const { userId, carId, startDate, endDate } = data;

    if (!carId || !startDate || !endDate) {
        throw new Error("All fields are required");
    }

    const car = await Car.findByPk(carId);
    if (!car) throw new Error("Car not found");

    if (!car.availability) throw new Error("Car is not available");

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = (end - start) / (1000 * 60 * 60 * 24);

    if (days <= 0) throw new Error("Invalid date range");

    const overlapping = await Booking.findOne({
        where: {
            carId,
            status: "pending",
            [Op.and]: [
                { startDate: { [Op.lte]: endDate } },
                { endDate: { [Op.gte]: startDate } }
            ]
        }
    });

    if (overlapping) {
        throw new Error("Car is already booked for these dates");
    }

    const totalAmount = days * car.pricePerDay;

    const booking = await Booking.create({
        userId,
        carId,
        startDate,
        endDate,
        totalAmount,
        status: "pending"
    });

    return booking;
};

const updateBooking = async (id, data) => {
    const booking = await Booking.findByPk(id);

    if (!booking) {
        throw new Error("Booking not found");
    }

    await booking.update(data);
    return booking;
};

const confirmBooking = async (bookingId) => {
    try {
        const booking = await Booking.findOne({ where: { id: bookingId } });

        if (!booking) {
            return { message: "Booking not found" };
        }

        if (booking.status === "confirmed") {
            return {
                success: false,
                message: "Booking is already confirmed"
            };
        }

        booking.status = "confirmed";
        await booking.save();

        return {
            success: true,
            booking
        };

    } catch (error) {
        console.error("Booking Confirm Service Error:", error);
    }
};

const cancelBooking = async (id) => {
    const booking = await Booking.findByPk(id);

    if (!booking) {
        throw new Error("Booking not found");
    }

    await booking.update({ status: "cancelled" });

    return booking;
};

const getAllBookings = async () => {
    return Booking.findAll();
};

const getBookingById = async (id) => {
    const booking = await Booking.findByPk(id);

    if (!booking) {
        throw new Error("Booking not found");
    }

    return booking;
};

const getByUserId = async (userId) => {
    const bookings = await Booking.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
    return bookings;
}

module.exports = {
    createBooking,
    updateBooking,
    confirmBooking,
    cancelBooking,
    getAllBookings,
    getBookingById,
    getByUserId
};