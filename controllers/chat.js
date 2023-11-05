const Messages = require("../models/messages");
const Users = require("../models/users");
const Sequelize = require("sequelize");

exports.postMessage = async (req, res) => {
  try {
    const message = req.body.message;
    const newMessage = await Messages.create({
      message,
      userId: req.user.id,
    });
    const user = await Users.findByPk(req.user.id, {
      attributes: ["name"],
    });
    res.status(201).json({ name: user.name, message: newMessage.message });
  } catch (error) {
    res.status(500).json({ err: "error in posting message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messagesArray = await Messages.findAll({
      attributes: ["message", "id"],
      order: [["createdAt", "ASC"]],
      include: [{ model: Users, attributes: ["name"] }],
    });
    const transformedArray = messagesArray.map((element) => ({
      id : element.id,
      name: element.user.name,
      message: element.message,
    }));
    res.status(200).json(transformedArray);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getNewMessages = async (req, res) => {
  try {
    const lastMessageId = req.query.lastMessageId || 0; // Get the lastMessageId from the query parameter
    const newMessagesArray = await Messages.findAll({
      where: {
        id: {
          [Sequelize.Op.gt]: lastMessageId,
        },
      },
      attributes: ["message", "id"],
      include: [{ model: Users, attributes: ["name"] }],
      order: [["createdAt", "ASC"]],
    });

    const transformedArray = newMessagesArray.map((element) => ({
      id : element.id,
      name: element.user.name,
      message: element.message,
    }));

    res.status(200).json(transformedArray);
  } catch (error) {
    res.status(500).json({ error });
  }
};
