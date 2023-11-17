const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const {
  listMembers,
  removeMember,
  makeAdmin,
} = require("../controllers/group-info");

router.post("/group-members", authenticate, listMembers);
router.post("/remove-member", authenticate, removeMember);
router.post("/make-admin", authenticate, makeAdmin);

module.exports = router;
