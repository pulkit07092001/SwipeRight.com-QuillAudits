const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 4,
      max: 20,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    photo: {
      type: String,
      default: "",
    },
    likedBy: {
      type: Array,
      default: [],
    },
    superLikedBy: {
      type: Array,
      default: [],
    },
    blocked: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);
