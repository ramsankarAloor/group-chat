const Messages = require("../models/messages");
const Users = require("../models/users");
const sequelize = require("../util/database");

exports.postMessage = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const message = req.body.message;
    const type = req.body.type;
    const groupId = Number(req.body.groupId);

    const newMessage = await Messages.create(
      {
        message,
        userId: req.user.id,
        groupId,
        type,
      },
      { transaction: t }
    );

    const user = await Users.findByPk(
      req.user.id,
      {
        attributes: ["name"],
      },
      { transaction: t }
    );

    await t.commit();

    res
      .status(201)
      .json({
        name: user.name,
        message: newMessage.message,
        id: newMessage.id,
        groupId,
      });
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    res.status(500).json({ err: "error in posting message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const groupId = req.query.groupId;
    const limit = 10; // Number of messages per page
    const offset = req.query.page ? (req.query.page - 1) * limit : 0;

    const messagesArray = await Messages.findAll({
      where: { groupId },
      attributes: ["message", "id", "type"],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      include: [{ model: Users, attributes: ["name"] }],
    });

    const transformedArray = messagesArray
      .map((element) => ({
        id: element.id,
        name: element.user.name,
        message: element.message,
        groupId,
        type: element.type,
      }))
      .reverse();
      
    res.status(200).json(transformedArray);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
