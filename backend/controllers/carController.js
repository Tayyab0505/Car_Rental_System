const carService = require('../services/carService');

const addCar = async (req, res) => {
    try {
        const car = await carService.addCar(req.body);
        res.status(201).json({ message: "Car added successfully", car });
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

const updateCar = async (req, res) => {
    try {
        const car = await carService.updateCar(req.params.id, req.body);
        res.status(200).json({ message: "Car updated successfully", car });
    } catch (error) {
        res.status(500).json({ error: error.message });
    };
};

const findAllCar = async (req, res) => {
    try {
         const car = await carService.findAllCar();
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ error: error.message });
    };
};

const findById = async (req, res) => {
    try {
        const car = await carService.findById(req.params.id);
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ error: error.message });
    };
};

const deleteCar = async (req, res) => {
    try {
        await carService.deleteCar(req.params.id);
        res.status(200).json({ message: "Car deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
    };
};

module.exports = {
    addCar,
    updateCar,
    findAllCar,
    findById,
    deleteCar
}