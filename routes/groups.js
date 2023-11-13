const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const { createNewGroup } = require("../controllers/groups");

router.post("/create-new-group", authenticate, createNewGroup);

module.exports = router;