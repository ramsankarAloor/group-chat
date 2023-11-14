const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const GroupUser = sequelize.define("groupUser", {
    admin : {
        type : Sequelize.BOOLEAN,
        default : false
    }
});

module.exports = GroupUser;
