const carService = require('../services/carService')

const getImagePath = file => {
    if (!file) return null
    return `/uploads/cars/${file.filename}`
}

const getCarData = req => {
    const data = { ...req.body, availability: req.body.availability === true || req.body.availability === 'true' }

    const mainImage = req.files?.image?.[0]
    const secondImage = req.files?.image2?.[0]
    const thirdImage = req.files?.image3?.[0]

    if (mainImage) data.imageUrl = getImagePath(mainImage)
    if (secondImage) data.imageUrl2 = getImagePath(secondImage)
    if (thirdImage) data.imageUrl3 = getImagePath(thirdImage)

    return data
}

const addCar = async (req, res) => {
    try {
        const data = getCarData(req)

        if (!data.imageUrl) {
            return res.status(400).json({
                error: 'Main car image is required'
            })
        }

        const car = await carService.addCar(data)

        return res.status(201).json({
            message: 'Car added successfully',
            car
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const updateCar = async (req, res) => {
    try {
        const data = getCarData(req)

        if (!data.imageUrl) {
            return res.status(400).json({
                error: 'Main car image is required'
            })
        }

        const car = await carService.updateCar(req.params.id, data)

        return res.status(200).json({
            message: 'Car updated successfully',
            car
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const findAllCar = async (req, res) => {
    try {
        const cars = await carService.findAllCar()

        return res.status(200).json(cars)
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

const findAllAdminCars = async (req, res) => {
    try {
        const cars = await carService.findAllAdminCars()

        return res.status(200).json(cars)
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

const findById = async (req, res) => {
    try {
        const car = await carService.findById(req.params.id)

        return res.status(200).json(car)
    } catch (error) {
        return res.status(404).json({
            error: error.message
        })
    }
}

const deleteCar = async (req, res) => {
    try {
        await carService.deleteCar(req.params.id)

        return res.status(200).json({
            message: 'Car deleted successfully'
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}

module.exports = {
    addCar,
    updateCar,
    findAllCar,
    findAllAdminCars,
    findById,
    deleteCar
}