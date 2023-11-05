const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const { postMessage, getMessages, getNewMessages } = require("../controllers/chat");

router.post("/message", authenticate, postMessage);
router.get("/get-messages", authenticate, getMessages)
router.get("/get-new-messages", authenticate, getNewMessages);

module.exports = router;
