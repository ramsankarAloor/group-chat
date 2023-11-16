const GroupUser = require("../models/group-user");
const Users = require("../models/users");
const Groups = require("../models/groups");

exports.listMembers = async (req, res) => {
  try {
    const groupId = req.body.groupId;
    const userId = req.user.id;

    const admin = await GroupUser.findOne({
        where : { userId, groupId},
        attributes : ["admin"]
    })
    const members = await GroupUser.findAll({
      attributes: [],
      include: [{ model: Users, attributes : ["id", "name"] }],
      where: { groupId },
    });

    res.status(200).json({members, adminStatus : admin.admin});

  } catch (error) {
    res.status(500).json({ err: "error in listing group members", error });
  }
};
