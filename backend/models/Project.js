const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  techStack: {
    type: [String], // array of technologies
    default: [],
  },
  milestones: {
    type: [String], // array of milestone names or descriptions
    default: [],
  },
  blueprint: {
    type: [String], // could store file URLs, document links, or steps
    default: [],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  currentMilestone: {
    type: String, // could store milestone name or ID
    default: "",
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedMilestones: {
    type: Number, // count of completed milestones
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
