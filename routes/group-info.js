const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const { listMembers } = require("../controllers/group-info");

router.post("/group-members", authenticate, listMembers);

module.exports = router;
