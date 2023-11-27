const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const http = require('http'); // Add this line
const io = require('socket.io'); // Add this line
const sequelize = require("./util/database");

const Users = require("./models/users");
const Messages = require("./models/messages");
const Groups = require("./models/groups");
const GroupUser = require("./models/group-user");
const Invites = require("./models/invites");

const app = express();
const server = http.createServer(app); // Change this line
const socketIO = io(server); // Change this line

app.use(cors());
app.use(express.json());
const loginSignupRoutes = require("./routes/login-signup");
const chatRoutes = require("./routes/chat");
const groupRoutes = require("./routes/groups");
const groupInfoRoutes = require("./routes/group-info");
const { group } = require("console");

app.get("/", (req, res) => { // Change this line
  console.log("checkout");
  res.send("Checkout");
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

socketIO.on('connection', (socket) => {
  console.log("socket id >>>> ", socket.id);
  socket.on('send-message', (newMessage) => {
    // socket.broadcast.emit('receive-message', newMessage); // sending to all client sockets
    socket.to(newMessage.groupId).emit('receive-message', newMessage);
  })

  socket.on('send-media', (newMedia) => {
    socket.to(newMedia.groupId).emit('receive-media', newMedia);
  })

  socket.on('join-group', (room) => {
    socket.join(room);
  })

  socket.on('send-invite', (newInvite)=>{
    socket.broadcast.emit('receive-invite', newInvite);
  })
});

sequelize
  .sync()
  .then(() => server.listen(4000, () => console.log('Server is running on port 4000')))
  .catch((err) => console.log(err));
