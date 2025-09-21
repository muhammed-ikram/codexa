// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   username: String,
//   email: String,
//   password: String,
//   role: {
//     type: String,
//     enum: ["user", "admin"],
//     default: "user",
//   },
// });

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // make sure you have a Project model defined
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
