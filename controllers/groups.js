const Groups = require("../models/groups");
const GroupUser = require("../models/group-user");

exports.createNewGroup = async (req, res) => {
  try {
    const groupName = req.body.groupName;
    const newGroup = await Groups.create({
      groupName
    });
    await GroupUser.create({
      userId: req.user.id,
      groupId: newGroup.id,
      admin : true
    });
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ err: "error in creating new group" });
  }
};

exports.listGroups = async (req, res) => {
  try {
    const groupsList = await GroupUser.findAll({
      attributes: [],
      include: [
        {
          model: Groups,
          attributes: ["groupName", "id"], // Specify the attributes you want to retrieve
          required: true, // Use inner join, change to false for left join
        },
      ],
      where: { userId: req.user.id },
    });
    res.status(200).json(groupsList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error in listing groups" });
  }
};
