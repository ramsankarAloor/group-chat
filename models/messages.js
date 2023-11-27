const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Messages = sequelize.define("messages", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type : {
    type : Sequelize.STRING,
    allowNull : false,
    default : "text"
  }
});

module.exports = Messages;
