const userService = require('../services/userService.js');

const register = async (req, res) => {
    try {
        const user = await userService.register(req.body);
        return res.status(200).json({ message: "User registered successfully", user });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    };
};

const login = async (req, res) => {
    try {

        const result = await userService.login(req.body);
        return res.status(200).json({ message: "Login Successfull", token: result.token, user: result.user });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    };
};

module.exports = {
    register,
    login
};