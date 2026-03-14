var DataTypes = require("sequelize").DataTypes;
var _booking = require("./booking");
var _car = require("./car");
var _user = require("./user");

function initModels(sequelize) {
  var booking = _booking(sequelize, DataTypes);
  var car = _car(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
 
  user.hasMany(booking, { foreignKey: "userId", onDelete: "CASCADE" });
  booking.belongsTo(user, { foreignKey: "userId" });

  car.hasMany(booking, { foreignKey: "carId", onDelete: "CASCADE" });
  booking.belongsTo(car, { foreignKey: "carId" });

  return {
    booking,
    car,
    user,
  };
};

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;