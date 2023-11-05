const Messages = require("../models/messages");
const Users = require("../models/users");

exports.postMessage = async (req, res) => {
  try {
    const message = req.body.message;
    const newMessage = await Messages.create({
      message,
      userId: req.user.id,
    });
    const user = await Users.findByPk(req.user.id, {
      attributes: ['name'],
    });
    res.status(201).json({name : user.name, message : newMessage.message});
  } catch (error) {
    res.status(500).json({ err: "error in posting message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messagesArray = await Messages.findAll({
      attributes: ["message"],
      order: [["createdAt", "ASC"]],
      include: [{ model: Users, attributes: ["name"] }],
    });
    const transformedArray = messagesArray.map((element) => ({
      name: element.user.name, 
      message: element.message,
    }));
    res.status(200).json(transformedArray);
  } catch (error) {
    res.status(500).json({ error });
  }
};
