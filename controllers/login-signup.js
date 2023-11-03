const Users = require("../models/users");
const bcrypt = require("bcrypt");

exports.postSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ err: "Bad parameters. Something is missing." });
    }
    const existingEmail = await Users.findOne({
      where: { email: email },
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
