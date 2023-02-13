const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
// const multer = require("multer");
// const { v4: uuidv4 } = require("uuid");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
//   },
// });
// const fileFilter = (req, file, cb) => {
//   const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
//   if (allowedFileTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };
// let upload = multer({ storage, fileFilter });

exports.registerController = async (req, res) => {
  try {
    //generate new password
    // console.log(req.file.filename);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      photo: req.file.filename,
    });

    res.status(200).json({
      status: "SUCCESS",
      message: "User has been created successfully",
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.loginController = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(404).json("user not found");
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(400).json("wrong password");
    const token = generateToken({ id: user._id });
    const { password, ...others } = user._doc;
    res.status(200).json({ token, user: { ...others } });
  } catch (err) {
    res.status(500).json(err);
  }
};
