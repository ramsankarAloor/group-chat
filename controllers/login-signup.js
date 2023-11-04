const Users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.postSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ err: "Bad parameters. Something is missing." });
    }
    const existingEmail = await Users.findOne({
      where: { email },
    });
    if (existingEmail) {
      return res.status(403).json({ err: "email is not unique" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newEntry = await Users.create({ name, email, password: hash });
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: "error in signup" });
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ err: "Bad paramaters." });
    }

    const existing = await Users.findOne({
      where: { email },
    });
    if (!existing) {
      return res.status(404).json({ err: "User not found " });
    }
    const savedPassword = existing.dataValues.password;
    const isMatch = await bcrypt.compare(password, savedPassword);
    if (!isMatch) {
      return res.status(401).json({ err: "Wrong password" });
    }
    res
      .status(200)
      .json({
        message: "User logged successfully",
        accessToken: generateAccessToken(existing.dataValues.id),
      });
  } catch (error) {
    res.status(500).json({ "error message": "error in login" });
  }
};

function generateAccessToken(id_given) {
  return jwt.sign({ userId: id_given }, process.env.ACCESS_TOKEN_SECRET);
}
