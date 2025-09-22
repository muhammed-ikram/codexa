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
  // Structured milestones for easier tracking in UI
  milestones: [
    new mongoose.Schema({
      id: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, default: "" },
      priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
      estimatedTime: { type: String, default: "" },
      completed: { type: Boolean, default: false }
    }, { _id: false })
  ],
  // Directed edges for flow chart rendering { from, to }
  blueprint: [
    new mongoose.Schema({
      from: { type: String, required: true },
      to: { type: String, required: true }
    }, { _id: false })
  ],
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
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
