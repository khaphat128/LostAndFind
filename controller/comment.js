const { ObjectId } = require("mongodb");
const commentModel = require("../model/comment");

const createComment = async (req, res) => {
  try {
    let { message, postId } = req.body;
    const user = req.user;
    const newComment = await commentModel.create({
      message: message,
      createdAt: Date.now(),
      post: new ObjectId(postId),
      user: new ObjectId(user._id),
    });
    return res.status(200).send({
      message: "successfully",
      data: newComment,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createComment,
};
