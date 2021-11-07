const express = require("express");
const Post = require("../models/PostModel");
const router = express.Router();

// create a post
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.json({ savedPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update a post
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.json({ msg: "Post updated" });
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// delete a post
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    if (post.userId === userId) {
      await post.deleteOne({ $set: req.body });
      res.json({ msg: "Post Deleted" });
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// like a post
// get a post
// get timeline posts

module.exports = router;
