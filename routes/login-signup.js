const express = require("express");
const router = express.Router();

const { postSignup } = require("../controllers/login-signup");

router.post("/signup", postSignup);

module.exports = router;
