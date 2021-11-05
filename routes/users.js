const express = require("express");
const router = express.Router();

router.route("/").get((req, res) => {
  res.json({ msg: "User Page" });
});

module.exports = router;
