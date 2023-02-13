const router = require("express").Router();

const authenticateToken = require("../utils/authenticateToken");
const {
  getAllUsers,
  likeUser,
  superLikeUser,
  blockUser,
} = require("../controllers/userController");

//get all users
router.get("/", authenticateToken, getAllUsers);

//like user
router.put("/:id/like", authenticateToken, likeUser);

//superlike user
router.put("/:id/superlike", authenticateToken, superLikeUser);

//block user
router.put("/:id/block", authenticateToken, blockUser);

module.exports = router;
