const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const { postMessage } = require("../controllers/chat");

router.post("/message", authenticate, postMessage);

module.exports = router;
