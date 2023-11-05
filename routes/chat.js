const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const { postMessage, getMessages } = require("../controllers/chat");

router.post("/message", authenticate, postMessage);
router.get("/get-messages", authenticate, getMessages)

module.exports = router;
