const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  roleName: String,
}, {
  strictQuery: false
});

module.exports = mongoose.model("roles", roleSchema);