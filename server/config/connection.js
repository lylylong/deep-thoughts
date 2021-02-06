// This server uses Mongoose for all of its MongoDB data handling

const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/deep-thoughts",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);
// the mongoose.connection object is exported
// 输出到server.js
module.exports = mongoose.connection;
