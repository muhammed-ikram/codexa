const mongoose = require("mongoose");

// mongoose.connect(`mongodb://127.0.0.1:27017/PhotographyProject`);
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

module.exports = mongoose.model("User", userSchema);
