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
      res.status(403).json({ msg: "you can update only your post" });
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
router.put("/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.json({ msg: "post has been liked" });
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.json({ msg: "post has been disliked" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// get a post
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// get timeline posts

module.exports = router;
