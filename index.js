const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");

dotenv.config();

mongoose.connect(
  process.env.mongo_url,
  { userNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to MongoDB");
  }
);

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/users", userRoute);
app.use("/auth", authRoute);

app.get("/", (req, res) => {
  res.json({ msg: "Home Page" });
});

app.listen(3000, () => {
  console.log("Server Started yayy!!");
});
