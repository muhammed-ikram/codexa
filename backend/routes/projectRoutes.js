const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User'); // Import User to update projects
const { verifyToken } = require('../middlewares/authMiddleware');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Get all projects for logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    // Fetch directly from Project collection
    let projects = await Project.find({ createdBy: req.user.id });

    // If none found, fallback to user.projects (in case frontend relies on that)
    if (!projects || projects.length === 0) {
      const user = await User.findById(req.user.id).populate('projects');
      projects = user ? user.projects : [];
    }

    res.json({ projects });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new project
router.post('/', verifyToken, async (req, res) => {
  const { title, description, techStack } = req.body;
  if (!title || !description || !techStack) {
    return res
      .status(400)
      .json({ message: 'Title, description, and techStack are required' });
  }

  try {
    const project = new Project({
      title,
      description,
      techStack,
      createdBy: req.user.id,
      milestones: [],
      blueprint: [],
      currentMilestone: '',
      isCompleted: false,
    });

    await project.save();

    // Also push project into User.projects
    await User.findByIdAndUpdate(req.user.id, {
      $push: { projects: project._id },
    });

    res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single project by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ project });
  } catch (err) {
    console.error('Error fetching project by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate blueprint, description, milestones
router.post("/:id/generate", verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Prompt Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
    You are an AI project mentor. Based on this project:
    Title: ${project.title}
    Tech Stack: ${project.techStack.join(", ")}
    
    Generate:
    1. A clear project description.
    2. A list of milestones (step by step, max 8).
    3. A simple system flow (blueprint) as JSON array of { "from": "X", "to": "Y" }.

    Respond ONLY in strict JSON like this:
    {
      "description": "...",
      "milestones": ["...", "..."],
      "blueprint": [{"from":"...", "to":"..."}]
    }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON safely
    let structured;
    try {
      structured = JSON.parse(responseText);
    } catch (err) {
      return res.status(500).json({ message: "Failed to parse Gemini response", raw: responseText });
    }

    // Save to DB
    project.description = structured.description;
    project.milestones = structured.milestones;
    project.blueprint = structured.blueprint;
    await project.save();

    res.json({ message: "Generated successfully", project });
  } catch (err) {
    console.error("Error generating project blueprint:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update milestone progress
router.put("/:id/milestone", verifyToken, async (req, res) => {
  try {
    const { milestoneIndex, completed } = req.body; // { milestoneIndex: 0, completed: true }
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (completed) {
      project.currentMilestone = project.milestones[milestoneIndex];
    }

    // If all done → mark completed
    if (project.milestones.every((m, i) => i <= milestoneIndex)) {
      project.isCompleted = true;
    }

    await project.save();
    res.json({ message: "Milestone updated", project });
  } catch (err) {
    console.error("Error updating milestone:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
