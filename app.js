const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./util/database");

const Users = require("./models/users");
const Messages = require("./models/messages");
const Groups = require("./models/groups");
const GroupUser = require("./models/group-user");

const app = express();
app.use(cors());
app.use(express.json());
const loginSignupRoutes = require("./routes/login-signup");
const chatRoutes = require("./routes/chat");
const groupRoutes = require("./routes/groups");
const { group } = require("console");

app.checkout("/", (req, res) => {
  console.log("checkout");
});

app.use(loginSignupRoutes);
app.use("/chat-box", chatRoutes);
app.use("/groups", groupRoutes);

app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, `public/${req.url}`));
});

app.use((req, res) => {
  res.status(404).send("404 - Not Found");
});

Users.hasMany(Messages);
Messages.belongsTo(Users);
Groups.belongsToMany(Users, { through: GroupUser });
Users.belongsToMany(Groups, { through: GroupUser });
Groups.hasMany(Messages);
Messages.belongsTo(Groups);

sequelize
  .sync()
  .then(() => app.listen(3000))
  .catch((err) => console.log(err));
