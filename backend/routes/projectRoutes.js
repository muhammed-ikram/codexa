const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { verifyToken } = require('../middlewares/authMiddleware');

// Get all projects for logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id });
    res.json({ projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new project
router.post('/', verifyToken, async (req, res) => {
  const { title, description, techStack } = req.body;
  if (!title || !description || !techStack) {
    return res.status(400).json({ message: 'Title, description, and techStack are required' });
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
    res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
