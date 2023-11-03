const Sequelize = require("sequelize");

const dbName = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;

if (!dbName || !dbUsername || !dbPassword || !dbHost) {
  throw new Error("One or more environment variables are missing.");
}

const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
  dialect: "mysql",
  host: dbHost,
});

module.exports = sequelize;
