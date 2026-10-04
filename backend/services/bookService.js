const initModels = require('../models/init-models')
const { sequelize } = require('../config/db')
const { Op } = require('sequelize')

const models = initModels(sequelize)

const Booking = models.booking
const Car = models.car

const attachCars = async bookings => {
    if (!bookings.length) return []

    const carIds = [...new Set(bookings.map(booking => booking.carId))]

    const cars = await Car.findAll({
        where: {
            id: {
                [Op.in]: carIds
            }
        }
    })

    const carMap = new Map(cars.map(car => [car.id, car.toJSON()]))

    return bookings.map(booking => ({ ...booking.toJSON(), car: carMap.get(booking.carId) || null }))
}

const createBooking = async data => {
    const { userId, carId, startDate, endDate } = data

    if (!carId || !startDate || !endDate) {
        throw new Error('All fields are required')
    }

    const start = new Date(`${startDate}T00:00:00Z`)
    const end = new Date(`${endDate}T00:00:00Z`)

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
        throw new Error('Invalid date range')
    }

    const car = await Car.findByPk(carId)

    if (!car) {
        throw new Error('Car not found')
    }

    if (!car.availability || car.status === 'booked' || car.status === 'maintenance') {
        throw new Error('Car is not available for booking')
    }

    const duplicate = await Booking.findOne({
        where: {
            userId,
            carId,
            status: {
                [Op.in]: ['pending', 'confirmed']
            },
            startDate: {
                [Op.lte]: endDate
            },
            endDate: {
                [Op.gte]: startDate
            }
        }
    })

    if (duplicate) {
        throw new Error('You already have a booking for this car on these dates')
    }

    const conflict = await Booking.findOne({
        where: {
            carId,
            status: {
                [Op.in]: ['pending', 'confirmed']
            },
            startDate: {
                [Op.lte]: endDate
            },
            endDate: {
                [Op.gte]: startDate
            }
        }
    })

    if (conflict) {
        throw new Error(`This car is already booked from ${conflict.startDate} to ${conflict.endDate}`)
    }

    const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    )

    const totalAmount = days * Number(car.pricePerDay)

    return await Booking.create({
        userId,
        carId,
        startDate,
        endDate,
        totalAmount,
        status: 'pending'
    })
}

const confirmBooking = async bookingId => {
    const booking = await Booking.findByPk(bookingId)

    if (!booking) {
        throw new Error('Booking not found')
    }

    if (booking.status === 'confirmed') {
        return {
            success: false,
            message: 'Booking is already confirmed'
        }
    }

    if (booking.status === 'cancelled') {
        return {
            success: false,
            message: 'Cancelled booking cannot be confirmed'
        }
    }

    await booking.update({
        status: 'confirmed'
    })

    await Car.update(
        {
            status: 'booked',
            availability: false
        },
        {
            where: {
                id: booking.carId
            }
        }
    )

    return {
        success: true,
        booking
    }
}

const updateBooking = async (id, data) => {
    const booking = await Booking.findByPk(id)

    if (!booking) {
        throw new Error('Booking not found')
    }

    await booking.update(data)

    return booking
}

const cancelBooking = async (id, userId) => {
    const booking = await Booking.findByPk(id)

    if (!booking) {
        throw new Error('Booking not found')
    }

    if (Number(booking.userId) !== Number(userId)) {
        throw new Error('You can only cancel your own booking')
    }

    if (booking.status === 'cancelled') {
        throw new Error('Booking is already cancelled')
    }

    if (booking.status === 'confirmed') {
        throw new Error('Confirmed booking cannot be cancelled')
    }

    if (booking.status !== 'pending') {
        throw new Error('Only pending bookings can be cancelled')
    }

    await booking.update({
        status: 'cancelled'
    })

    return booking
}

const getAllBookings = async () => {
    const bookings = await Booking.findAll({
        order: [['createdAt', 'DESC']]
    })

    return await attachCars(bookings)
}

const getBookingById = async id => {
    const booking = await Booking.findByPk(id)

    if (!booking) {
        throw new Error('Booking not found')
    }

    const [result] = await attachCars([booking])

    return result
}

const getByUserId = async userId => {
    const bookings = await Booking.findAll({
        where: {
            userId
        },
        order: [['createdAt', 'DESC']]
    })

    return await attachCars(bookings)
}

module.exports = {
    createBooking,
    updateBooking,
    confirmBooking,
    cancelBooking,
    getAllBookings,
    getBookingById,
    getByUserId
}