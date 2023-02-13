const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    let users = await User.find();
    users = users.filter(
      (user) => user._id != req.user.id && !user.blocked.includes(req.user.id)
    );
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.blockUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser.blocked.includes(req.params.id)) {
      await currentUser.updateOne({ $push: { blocked: req.params.id } });
      res.status(200).json("The user has been blocked");
    } else {
      await currentUser.updateOne({ $pull: { blocked: req.params.id } });
      res.status(200).json("The user has been unblocked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.likeUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user.likedBy.includes(req.user.id)) {
      await user.updateOne({ $push: { likedBy: req.user.id } });
      res.status(200).json("The user has been liked");
    } else {
      await user.updateOne({ $pull: { likedBy: req.user.id } });
      res.status(200).json("The user has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.superLikeUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user.superLikedBy.includes(req.user.id)) {
      await user.updateOne({ $push: { superLikedBy: req.user.id } });
      res.status(200).json("The user has been liked");
    } else {
      await user.updateOne({ $pull: { superLikedBy: req.user.id } });
      res.status(200).json("The user has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
