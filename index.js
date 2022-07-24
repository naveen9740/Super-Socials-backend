const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const multer = require("multer");
const path = require("path");
const port = 3000;

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/posts", postRoute);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     console.log("11111", req, file);
//     cb(null, "../super-socials-frontend/public/assets/post");
//   },
//   filename: (req, file, cb) => {
//     console.log(file, "222222");
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage });
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    return res.json("File uploaded Successfully");
  } catch (error) {
    console.log("EEEEE");
    console.log(error.message);
  }
});

app.get("/", (req, res) => {
  res.json({ msg: "Home Page" });
});

app.use("*", (req, res) => {
  res.json({ msg: "page not found :(" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Started yayy!!");
});
