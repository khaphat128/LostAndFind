const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    password: String,
    name: String,
    email: String,
    phoneNumber: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: Date,
    role: {
      type: Schema.Types.ObjectId,
      ref: "roles",
    },
    post: [
      {
        type: Schema.Types.ObjectId,
        ref: "posts",
      },
    ],
    avt: String,
  },
  {
    strictQuery: false,
  }
);

module.exports = mongoose.model("users", userSchema);
