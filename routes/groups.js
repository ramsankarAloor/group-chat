const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const { createNewGroup, listGroups } = require("../controllers/groups");

router.post("/create-new-group", authenticate, createNewGroup);
router.get("/list-groups", authenticate, listGroups);

module.exports = router;
