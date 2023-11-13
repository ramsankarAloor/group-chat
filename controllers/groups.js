const Groups = require("../models/groups");
const GroupUser = require("../models/group-user");

exports.createNewGroup = async (req, res) => {
    try {
        const groupName = req.body.groupName;
        const newGroup = await Groups.create({
            groupName, 
            userId : req.user.id
        })
        await GroupUser.create({
            userId : req.user.id,
            groupId : newGroup.id
        })
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({err : "error in creating new group"})
    }
}