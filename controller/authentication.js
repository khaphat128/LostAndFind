const bcrypt = require("bcrypt");
const userModel = require("../model/user");
const roleModel = require("../model/role");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const privateKey = "e9LCdJeYuu0onP3fgcOOhwvETgSP";

const register = async (req, res) => {
  try {
    let {
      username,
      password,
      name,
      email,
      roleName = "user",
      avt = "",
    } = req.body;

    const role = await roleModel.findOne({
      roleName: roleName,
    });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username: username,
      password: hashPassword,
      name: name,
      email: email,
      role: role._id,
      avt: avt,
    });

    return res.status(201).send(newUser);
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    let { username, password } = req.body;

    let user = await userModel.findOne({
      username: username,
    });

    if (!user) {
      return res.status(400).send("User doest not exist");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).send("Password invalid");
    }

    user = await userModel
      .findOne(
        {
          username: username,
        },
        "-password"
      )
      .populate("role");

    const token = await jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      privateKey
    );

    return res.status(200).send({
      data: {
        user,
        token,
      },
      message: "login successful",
    });
  } catch (error) {
    console.log(error);
  }
};

const protected = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (
      !token ||
      token === null ||
      token === undefined ||
      token === "undefined"
    ) {
      return res.status(403).send("please login!");
    }
    token = token.replace("Bearer ", "");

    const data = jwt.verify(token, privateKey);
    const user = await userModel
      .findOne(
        {
          _id: data._id,
        },
        "-password"
      )
      .populate("role");

    // console.log(
    //   await userModel
    //     .find(
    //       {
    //         // username: {
    //         //   $regex: /12/
    //         // }
    //       },
    //       "-password"
    //     )
    //     .populate("role")
    // );

    // const users = await userModel.find({
    //   username: {
    //     $regex: /12/
    //   }
    // }, "-password").populate("role")

    // for (const element of users) {
    //   console.log(element.role)
    //   console.log(element.role.roleName)
    // }

    if (!user) {
      throw new Error();
    }
    req.user = user;

    return next();
  } catch (error) {
    console.log(error);
  }
};

const verifyRole = (role) => {
  return async (req, res, next) => {
    if (!role.includes(req.user.role.roleName)) {
      return res.status(401).send("you don't have permission");
    }
    return next();
  };
};

const getOneUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    // console.log("userId");
    const data = await userModel.aggregate([
      { $match: { _id: new ObjectId(userId) } },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "user",
          as: "posts",
        },
      },
    ]);

    console.log(data);
    return res.status(200).send({
      message: "successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

const getMe = async (req, res) => {
  // console.log("getMe");
  try {
    const username = req.body.username;
    console.log(username);
    const user = await userModel
      .findOne(
        {
          username: username,
        },
        "-password"
      )
      .populate("role");
    // console.log(user);
    return res.status(200).send({
      data: user,
      message: "successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
  login,
  protected,
  verifyRole,
  getOneUser,
  getMe,
};
