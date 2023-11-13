const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const GroupUser = sequelize.define("groupUser", {});

module.exports = GroupUser;
