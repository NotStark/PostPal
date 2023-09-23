const multer = require("multer");
const fs = require("fs");
const Post = require("./../../models/post");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

uploadsDestination = "uploads/";

if (!fs.existsSync(uploadsDestination)) {
  fs.mkdirSync(uploadsDestination);
}

const maxFileSize = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDestination);
  },
  filename: async (req, file, cb) => {
    if (file.size > maxFileSize) {
      const error = new Error("File size exceeds the maximum limit of 5MB.");
      error.status = 400;
      return cb(error);
    }

    var fileId = uuidv4();
    file = fileId.replace(/-/g, "") + path.extname(file.originalname);

    await Post.create({
      file,
      visitHistory: [],
    });

    cb(null, file);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: maxFileSize },
});

module.exports = upload;
