const { models } = require('../config/db');
const Car = models.car;

const addCar = async (data) => {
    const { model, brand, pricePerDay, availability, imageUrl, country, city } = data;

    if (!model || !brand || !pricePerDay || availability === "") {
        throw new Error("Please fill all required fields");
    };
    return await Car.create({ model, brand, pricePerDay, availability, imageUrl, country, city });
};

const updateCar = async (id, data) => {
    const { model, brand, pricePerDay, availability, imageUrl, country, city } = data;

    if (!model || !brand || !pricePerDay || availability === "") {
        throw new Error("Please fill all required fields");
    };

    const [updated] = await Car.update(
        { model, brand, pricePerDay, availability, imageUrl, country, city },
        { where: { id } }
    );

    if (!updated) throw new Error("Car not found");

    return await Car.findByPk(id);
};

const findAllCar = async () => {
    const car = await Car.findAll({ where: { availability: true } });
    if (car.length === 0) {
        throw new Error("No cars found");
    };

    return car;
};

const findById = async (id) => {
    if (!id) {
        throw new Error("Car ID is required");
    }

    const car = await Car.findOne({ where: { id, availability: true } });

    if (!car) {
        throw new Error("Car not found on this ID");
    }

    return car;
}

const deleteCar = async (id) => {
    if (!id) {
        throw new Error("Car ID is required");
    };

    const car = await Car.findOne({ where: { id, availability: true } });

    if (!car) {
        throw new Error("Car not found or already unavailable");
    };

    await Car.update({ availability: false }, { where: { id } });

    return true;
};

module.exports = {
    addCar,
    updateCar,
    findAllCar,
    findById,
    deleteCar
};