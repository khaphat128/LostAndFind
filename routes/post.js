var express = require("express");
var router = express.Router();
const { protected, verifyRole } = require("../controller/authentication");

const {
  createPost,
  editPost,
  getAllPosts,
  getOne,
  approvePostByAdmin,
  updateStatusToFoundByUser,
} = require("../controller/post");
const { findOneAndUpdate } = require("../model/user");

router.post("/", protected, verifyRole(["user"]), createPost);

router.put("/:postId", protected, verifyRole(["user"]), editPost);

router.post("/search", protected, verifyRole(["user", "admin"]), getAllPosts);

router.put(
  "/found/:postId",
  protected,
  verifyRole(["user"]),
  updateStatusToFoundByUser
);
router.get("/:postId", getOne);
router.post(
  "/approve/:postId",
  protected,
  verifyRole(["admin"]),
  approvePostByAdmin
);
module.exports = router;
