const Groups = require("../models/groups");
const GroupUser = require("../models/group-user");
const Users = require("../models/users");
const Invites = require("../models/invites");

exports.createNewGroup = async (req, res) => {
  try {
    const groupName = req.body.groupName;
    const newGroup = await Groups.create({
      groupName,
    });
    await GroupUser.create({
      userId: req.user.id,
      groupId: newGroup.id,
      admin: true,
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

exports.sendInvite = async (req, res) => {
  try {
    const senderId = req.user.id;
    const groupId = req.body.groupId;
    const inviteeEmail = req.body.inviteeEmail;
    const invitee = await Users.findOne({
      where: {
        email: inviteeEmail,
      },
    });
    const newInvite = await Invites.create({
      fromId: senderId,
      groupId,
      toId: invitee.id,
    });
    res.status(201).json({ newInvite, success: "new invite sent." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "error in sending invite" });
  }
};

exports.listInvites = async (req, res) => {
  try {
    const invitesList = await Invites.findAll({
      where: { toId: req.user.id },
      include : [
        {
          model : Users
        },
        {
          model : Groups
        }
      ]
    });
    const transformedList = invitesList.map((element) => ({
      id : element.id,
      group : element.group,
      fromUser : element.user
    }));
    res.status(200).json(transformedList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "error in listing invites" });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const groupId = req.body.groupId;
    const inviteId = req.body.inviteId;
    await GroupUser.create({
      userId : req.user.id,
      groupId
    })
    await Invites.destroy({
      where : { id : inviteId }
    })
  } catch (error) {
    
  }
}