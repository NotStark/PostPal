const mongoose = require("mongoose");

async function connectToMongo(url) {
  return mongoose.connect(url, { dbName: "PostPal" });
}

module.exports = connectToMongo;
