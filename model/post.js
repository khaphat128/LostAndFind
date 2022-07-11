const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: String,
    location: String,
    image: String,
    status: String,
    identifyMark: String,
    secretInformations: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: Date,
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    comment: [
      {
        type: Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
    lost: String,
    found: String,
    statusDate: Date,
    phoneNumber: String,
  },
  {
    strictQuery: false,
  }
);

module.exports = mongoose.model("posts", postSchema);
