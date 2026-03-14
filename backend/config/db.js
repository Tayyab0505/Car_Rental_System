const { Sequelize } = require('sequelize');
const { initModels } = require('../models/init-models');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: false
    }
);

const models = initModels(sequelize);

sequelize.authenticate()
    .then(() => {
        console.log(' DB connected');
    })
    .catch((err) => {
        console.error(' DB connection error:', err);
    });

sequelize.sync({ force: false })
    .then(() => {
        console.log('Tables synced');
    })
    .catch((err) => {
        console.error('Sync error:', err);
    });

module.exports = {
    sequelize,
    models
};