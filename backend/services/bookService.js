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
    if (!car) {
        throw new Error("Car not found");
    }

    if (!car.availability || car.status === 'booked' || car.status === 'maintenance') {
        throw new Error("Car is not available for booking");
    }

    const conflict = await Booking.findOne({
        where: {
            carId,
            status: { [Op.in]: ['pending', 'confirmed'] },
            [Op.or]: [
                {
                    startDate: { [Op.between]: [startDate, endDate] }
                },
                {
                    endDate: { [Op.between]: [startDate, endDate] }
                },
                {
                    [Op.and]: [
                        { startDate: { [Op.lte]: startDate } },
                        { endDate: { [Op.gte]: endDate } }
                    ]
                }
            ]
        }
    });

    if (conflict) {
        throw new Error(`This car is already booked from ${conflict.startDate} to ${conflict.endDate}`);
    };

    const duplicate = await Booking.findOne({
        where: {
            userId,
            carId,
            status: { [Op.in]: ['pending', 'confirmed'] },
            [Op.or]: [
                { startDate: { [Op.between]: [startDate, endDate] } },
                { endDate: { [Op.between]: [startDate, endDate] } },
                {
                    [Op.and]: [
                        { startDate: { [Op.lte]: startDate } },
                        { endDate: { [Op.gte]: endDate } }
                    ]
                }
            ]
        }
    });

    if (duplicate) {
        throw new Error('You already have a booking for this car on these dates')
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = (end - start) / (1000 * 60 * 60 * 24);
    const totalAmount = days * Number(car.pricePerDay);

    if (days <= 0) {
        throw new Error("Invalid date range");
    }

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

const confirmBooking = async (bookingId) => {
    const booking = await Booking.findByPk(id);
    if (!booking) {
        throw new Error('Booking not found');
    }

    await booking.update({ status: 'confirmed' });
    await Car.update(
        { status: 'booked', availability: false },
        { where: { id: booking.carId } }
    );

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


};

const updateBooking = async (id, data) => {
    const booking = await Booking.findByPk(id);
    if (!booking) {
        throw new Error("Booking not found");
    }

    await booking.update(data);
    return booking;
};

const cancelBooking = async (id) => {
    const booking = await Booking.findByPk(id);
    if (!booking) {
        throw new Error("Booking not found");
    }
    await booking.update({ status: "cancelled" });

    const otherActive = await Booking.findOne({
        where: {
            carId: booking.carId,
            status: 'confirmed',
            id: { [Op.ne]: id }
        }
    });
    if (!otherActive) {
        await Car.update(
            { status: 'available', availability: true },
            { where: { id: booking.carId } }
        )
    }

    return booking;
};

const getAllBookings = async () => {
    return await Booking.findAll({ order: [['createdAt', 'DESC']] })
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