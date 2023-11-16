const GroupUser = require("../models/group-user");
const Users = require("../models/users");
const Groups = require("../models/groups");
const sequelize = require("../util/database");

exports.listMembers = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const groupId = req.body.groupId;
        const userId = req.user.id;

        const admin = await GroupUser.findOne(
            {
                where: { userId, groupId },
                attributes: ["admin"],
            },
            { transaction: t }
        );

        const members = await GroupUser.findAll(
            {
                attributes: ["admin"],
                include: [{ model: Users, attributes: ["id", "name", "email"] }],
                where: { groupId },
            },
            { transaction: t }
        );

        await t.commit();

        res.status(200).json({ members, adminStatus: admin.admin });
    } catch (error) {
        if (t) {
            await t.rollback();
        }
        res.status(500).json({ err: "error in listing group members", error });
    }
};

exports.removeMember = async (req, res) => {
    try {
        const groupId = req.body.groupId;
        const memberId = req.body.memberId;

        await GroupUser.destroy({
            where: { groupId, userId: memberId }
        })

        res.status(200).json({ message: "member removed" });
    } catch (error) {
        res.status(500).json({ err: "error in removing member", error });
    }
};

exports.makeAdmin = async (req, res) => {
    try {
        const groupId = req.body.groupId;
        const memberId = req.body.memberId;

        const updateData = { admin: true }

        await GroupUser.update(updateData, {
            where: {
                groupId,
                userId: memberId
            }
        })
        res.status(200).json({message : "successfully made admin"});
    } catch (error) {
        res.status(500).json({ err: "error in making admin", error });
    }
}