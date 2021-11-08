const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const port = 3000;

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/posts", postRoute);

app.get("/", (req, res) => {
  res.json({ msg: "Home Page" });
});

app.listen(process.env.PORT || port, () => {
  console.log("Server Started yayy!!");
});
// 25
