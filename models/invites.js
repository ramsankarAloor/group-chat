const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Invites = sequelize.define("invites", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  }
});

module.exports = Invites;
