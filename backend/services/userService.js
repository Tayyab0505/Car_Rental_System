const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const initModels = require('../models/init-models.js');
const { sequelize } = require('../config/db.js');
const models = initModels(sequelize);
const User = models.user;

const register = async (data) => {
    const { name, email, password } = data;

    if (!name || !email || !password) {
        throw new Error("Please fill all the fields");
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
        throw new Error("Email already exists");
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: 'user' });

    return user;
};

const login = async (data) => {
    const { email, password } = data;

    if (!email || !password) {
        throw new Error("Please fill all the fields");
    };

    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error("User not found");
    };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid password");
    };

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "100d" }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

module.exports = {
    register,
    login
};