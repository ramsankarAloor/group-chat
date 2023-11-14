const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Invites = sequelize.define("invites", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fromId : {
    type: Sequelize.INTEGER
  },
  toId : {
    type : Sequelize.INTEGER
  }
});

module.exports = Invites;
