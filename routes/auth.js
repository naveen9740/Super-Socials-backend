const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

router
  .route("/register")
  .get((req, res) => {
    res.json({ msg: "hello" });
  })
  .post(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      // generate new Password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hashSync(password, salt);
      // Create new User
      const newUser = await new User({
        username,
        email,
        password: hashedPassword,
      });
      // Save user and return response
      const user = await newUser.save();
      res.status(200).json({ user });
    } catch (error) {
      res.json({ error: error.message });
    }
  });

module.exports = router;
