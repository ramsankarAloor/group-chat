const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const { listMembers, removeMember } = require("../controllers/group-info");

router.post("/group-members", authenticate, listMembers);
router.post("/remove-member", authenticate, removeMember);

module.exports = router;
