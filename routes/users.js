var express = require("express");
var router = express.Router();
const {
  register,
  login,
  protected,
  verifyRole,
  getOneUser,
  getMe,
} = require("../controller/authentication");
// const { getOne } = require("../controller/user");

/* GET users listing. */
router.get(
  "/",
  protected,
  verifyRole(["admin", "user"]),
  function (req, res, next) {
    res.send(req.user);
  }
);

router.post("/register", register);
router.post("/login", login);
router.get("/me", protected, verifyRole(["user"]), getMe);
router.get("/:userId", protected, verifyRole(["admin"]), getOneUser);
module.exports = router;
