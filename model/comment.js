const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    message: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "posts",
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    strictQuery: false,
  }
);

module.exports = mongoose.model("comments", commentSchema);
