const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    file: {
      type: String,
      required: true,
      unique: true,
    },

    visitHistory: [{ timestamp: { type: Number } }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Posts", postSchema);

module.exports = Post;
