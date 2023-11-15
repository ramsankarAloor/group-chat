const Messages = require("../models/messages");
const Users = require("../models/users");
const Sequelize = require("sequelize");

exports.postMessage = async (req, res) => {
  try {
    const message = req.body.message;
    const groupId = Number(req.body.groupId);
    const newMessage = await Messages.create({
      message,
      userId: req.user.id,
      groupId
    });
    const user = await Users.findByPk(req.user.id, {
      attributes: ["name"],
    });
    res.status(201).json({ name: user.name, message: newMessage.message, id : newMessage.id, groupId});
  } catch (error) {
    res.status(500).json({ err: "error in posting message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const groupId = req.query.groupId;
    const messagesArray = await Messages.findAll({
      where : {groupId},
      attributes: ["message", "id"],
      order: [["createdAt", "ASC"]],
      include: [{ model: Users, attributes: ["name"] }],
    });
    const transformedArray = messagesArray.map((element) => ({
      id : element.id,
      name: element.user.name,
      message: element.message,
      groupId
    }));
    res.status(200).json(transformedArray);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.getNewMessages = async (req, res) => {
  try {
    const groupId = req.query.groupId;
    const lastMessageId = req.query.lastMessageId; // Get the lastMessageId from the query parameter
    const newMessagesArray = await Messages.findAll({
      where: {
        id: {
          [Sequelize.Op.gt]: lastMessageId,
        },
        groupId
      },
      attributes: ["message", "id"],
      include: [{ model: Users, attributes: ["name"] }],
      order: [["createdAt", "ASC"]],
    });

    const transformedArray = newMessagesArray.map((element) => ({
      id : element.id,
      name: element.user.name,
      message: element.message,
      groupId
    }));

    res.status(200).json(transformedArray);
  } catch (error) {
    res.status(500).json({ error });
  }
};
