const { Schema, model } = require("mongoose");

const BlogSchema = new Schema(
  {
    title: String,
    description: String,
    name: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const BlogModel = model("BlogSchema", BlogSchema);

module.exports = BlogModel;
