const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const router = express.Router();

// get a user
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const { password, ...other } = user._doc;
  res.json({ other });
  try {
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// update user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  let { userId, isAdmin, password } = req.body;
  if (userId === id || isAdmin) {
    if (password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
    try {
      const user = await User.findByIdAndUpdate(id, { $set: req.body });
      res.json({ msg: "Account has been updated" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(403).json({ msg: "you can update only your account" });
  }
  res.json({ id });
});
// delete user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  let { userId, isAdmin } = req.body;
  if (userId === id || isAdmin) {
    try {
      const user = await User.deleteOne({ id });
      res.json({ msg: "Account has been Deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(403).json({ msg: "you can Delete only your account" });
  }
  res.json({ id });
});

// follow a user
router.put("/:id/follow", async (req, res) => {
  const { id } = req.params;
  let { userId } = req.body;
  if (id !== userId) {
    try {
      const user = await User.findById(id);
      const currentUser = await User.findById(userId);
      if (!user.followers.includes(userId)) {
        await user.updateOne({ $push: { followers: userId } });
        await currentUser.updateOne({ $push: { following: id } });
        res.json({ msg: "User has been followed" });
      } else {
        res.status(403).json({ msg: "You already follow this user" });
      }
    } catch (error) {
      res.status(500).json({ err: err.message });
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});
// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  const { id } = req.params;
  let { userId } = req.body;
  if (id !== userId) {
    try {
      const user = await User.findById(id);
      const currentUser = await User.findById(userId);
      if (user.followers.includes(userId)) {
        await user.updateOne({ $pull: { followers: userId } });
        await currentUser.updateOne({ $pull: { following: id } });
        res.json({ msg: "User has been unfollowed" });
      } else {
        res.status(403).json({ msg: "You already unfollow this user" });
      }
    } catch (error) {
      res.status(500).json({ err: err.message });
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

module.exports = router;
