const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["user", "blogger"], default: "user" },
});
const UserModel = model("UserSchema", UserSchema);

module.exports = UserModel;
