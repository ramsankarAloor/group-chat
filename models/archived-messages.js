const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ArchivedMessages = sequelize.define("archivedMessages", {
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

module.exports = ArchivedMessages;
