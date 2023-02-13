const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/users.js");
const authRouter = require("./routes/auth.js");
const path = require("path");
app.use("/images", express.static(path.join(__dirname, "public/images")));

dotenv.config();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO, (err) => {
  if (err) console.error(err);
  else console.log("mongoDB connected");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}...`);
});
