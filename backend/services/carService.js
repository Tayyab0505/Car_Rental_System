const { models } = require('../config/db')

const Car = models.car

const validateCar = data => {
    const { model, brand, pricePerDay, availability, country, city, category } = data

    if (!model || !brand || !pricePerDay || availability === undefined || !country || !city || !category) {
        throw new Error('Please fill all required fields')
    }
}

const addCar = async data => {
    validateCar(data)

    const { model, brand, pricePerDay, availability, imageUrl, imageUrl2, imageUrl3, country, city, year, transmission, fuelType, mileage, category, seats, priceperhour, status } = data

    return await Car.create({
        model,
        brand,
        pricePerDay,
        availability,
        imageUrl,
        imageUrl2,
        imageUrl3,
        country,
        city,
        year,
        transmission,
        fuelType,
        mileage,
        category,
        seats,
        priceperhour,
        status: status || 'available'
    })
}

const updateCar = async (id, data) => {
    validateCar(data)

    const { model, brand, pricePerDay, availability, imageUrl, imageUrl2, imageUrl3, country, city, year, transmission, fuelType, mileage, category, seats, priceperhour, status } = data

    const [updated] = await Car.update(
        {
            model,
            brand,
            pricePerDay,
            availability,
            imageUrl,
            imageUrl2,
            imageUrl3,
            country,
            city,
            year,
            transmission,
            fuelType,
            mileage,
            category,
            seats,
            priceperhour,
            status
        },
        {
            where: { id }
        }
    )

    if (!updated) {
        throw new Error('Car not found')
    }

    return await Car.findByPk(id)
}

const findAllCar = async () => {
    return await Car.findAll({
        where: {
            availability: true,
            status: 'available'
        }
    })
}

const findAllAdminCars = async () => {
    return await Car.findAll()
}

const findById = async id => {
    if (!id) {
        throw new Error('Car ID is required')
    }

    const car = await Car.findOne({
        where: {
            id,
            availability: true,
            status: 'available'
        }
    })

    if (!car) {
        throw new Error('Car not found')
    }

    return car
}

const deleteCar = async id => {
    if (!id) {
        throw new Error('Car ID is required')
    }

    const car = await Car.findByPk(id)

    if (!car) {
        throw new Error('Car not found')
    }

    await car.update({
        availability: false
    })

    return true
}

module.exports = {
    addCar,
    updateCar,
    findAllCar,
    findAllAdminCars,
    findById,
    deleteCar
}