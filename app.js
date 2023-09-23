require("dotenv").config();

const express = require("express");
const path = require("path");

const connectToMongo = require("./connect");
const upload = require("./public/js/uploadSetup");
const Post = require("./models/post");

const app = express();
const port = 3000;

connectToMongo(process.env.MONGO_URL)
  .then(() => console.log("Connected to Mongo!"))
  .catch((err) =>
    console.log("An Error occurred while connected to Mongo", err)
  );

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/file/:fileId", async (req, res) => {
  const file = req.params.fileId;
  await Post.findOneAndUpdate(
    { file },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );
  res.sendFile(path.join(__dirname, `uploads/${file}`));
});

app.post("/analytics", async (req, res) => {
  const file = req.body.fileId;
  if (!file) {
    res.send(404).json({ error: "fileId missing!" });
  } else {
    const fileDetails = await Post.findOne({ file });
    const timestamps = [];
    fileDetails.visitHistory.forEach((val) => timestamps.push(val.timestamp));
    res.json({
      totalViews: timestamps.length,
      visitedOn: timestamps,
    });
  }
});

app.post("/upload", (req, res) => {
  upload.single("file")(req, res, function (err) {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "File size exceeds the limit of 5MB." });
      }

      return res.status(500).json({ error: "Internal server error" });
    }

    const file = req.file.filename;
    res.json({ message: "File uploaded successfully!", id: file });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
