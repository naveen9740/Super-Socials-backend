const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// Register
router.route("/register").post(async (req, res) => {
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
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.find({ email:email });
    user.length==0 && res.status(404).json({ msg: "user not found" });
    
    console.log("ASDF",user,password);

    const validPassword = await bcrypt.compare(password, user.password);
    !validPassword && res.status(400).json({ msg: "wrong password" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
