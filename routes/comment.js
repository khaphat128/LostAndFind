var express = require("express");
var router = express.Router();
const { protected, verifyRole } = require("../controller/authentication");

const { createComment } = require("../controller/comment");

router.post("/", protected, verifyRole(["user"]), createComment);

module.exports = router;
