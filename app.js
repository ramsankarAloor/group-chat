const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./util/database");

const Users = require("./models/users");
const Messages = require("./models/messages");
const Groups = require("./models/groups");
const GroupUser = require("./models/group-user");
const Invites = require("./models/invites");

const app = express();
app.use(cors());
app.use(express.json());
const loginSignupRoutes = require("./routes/login-signup");
const chatRoutes = require("./routes/chat");
const groupRoutes = require("./routes/groups");
const groupInfoRoutes = require("./routes/group-info");
const { group } = require("console");

app.checkout("/", (req, res) => {
  console.log("checkout");
});

app.use(loginSignupRoutes);
app.use("/chat-box", chatRoutes);
app.use("/groups", groupRoutes);
app.use("/group-info", groupInfoRoutes);

app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, `public/${req.url}`));
});

app.use((req, res) => {
  res.status(404).send("404 - Not Found");
});
// message user relationship
Users.hasMany(Messages);
Messages.belongsTo(Users);
//group user relationship
Groups.belongsToMany(Users, { through: GroupUser });
Users.belongsToMany(Groups, { through: GroupUser });

GroupUser.belongsTo(Groups, { foreignKey: "groupId" });
Groups.hasMany(GroupUser, { foreignKey: "groupId" });
GroupUser.belongsTo(Users, { foreignKey: "userId" });
Users.hasMany(GroupUser, { foreignKey: "userId" });

//group message relationship

Groups.hasMany(Messages);
Messages.belongsTo(Groups);

//invitation relationships

Invites.belongsTo(Groups, { foreignKey: "groupId" });
Groups.hasMany(Invites, { foreignKey: "groupId" });
Users.hasMany(Invites, { foreignKey: "fromId" });
Invites.belongsTo(Users, { foreignKey: "fromId" });

sequelize
  .sync()
  .then(() => app.listen(4000))
  .catch((err) => console.log(err));
