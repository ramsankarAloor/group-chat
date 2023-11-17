const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const { createNewGroup, listGroups, sendInvite, listInvites, joinGroup } = require("../controllers/groups");

router.post("/create-new-group", authenticate, createNewGroup);
router.get("/list-groups", authenticate, listGroups);
router.post("/send-invite", authenticate, sendInvite);
router.get("/list-invites", authenticate, listInvites);
router.post("/join-group", authenticate, joinGroup);

module.exports = router;
