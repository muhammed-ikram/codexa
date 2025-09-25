const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User'); // Import User to update projects
const { verifyToken } = require('../middlewares/authMiddleware');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');
const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');
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
    const prompt = `You are an AI mentor. Using the project info below, output STRICT JSON suitable for storage.
Project:
  Title: ${project.title}
  Tech Stack: ${project.techStack.join(", ")}

RESPONSE FORMAT (no markdown, no code fences):
{
  "description": "string",
  "milestones": [
    { "id": "string-slug", "title": "string", "description": "string", "priority": "low|medium|high", "estimatedTime": "e.g. 2 days", "completed": false }
  ],
  "blueprint": [ { "from": "string-node", "to": "string-node" } ]
}

BLUEPRINT REQUIREMENTS:
- Create a project-specific workflow graph of 5 to 10 UNIQUE nodes.
- Nodes should reflect technologies/layers relevant to the tech stack (e.g., UI framework, API layer, auth, services, database, cache, queue, storage/CDN, observability, CI/CD).
- Include edges that form a coherent flow (top-down pipeline acceptable). Avoid trivial 2–3 node outputs.

MILESTONE RULES:
- Provide at most 8 concise, actionable milestones relevant to this project.

Do not include any commentary outside the JSON.
`;

    // Use Bedrock Nova Pro instead of Gemini (keep prompt and response format identical)
    const region = process.env.AWS_REGION || process.env.BEDROCK_REGION || 'us-east-1';
    const bedrockApiKey = process.env.BEDROCK_API_KEY;
    let responseText = '';
    if (bedrockApiKey) {
      try {
        const endpoint = process.env.BEDROCK_ENDPOINT || `https://bedrock-runtime.${region}.amazonaws.com/model/amazon.nova-pro-v1:0/converse`;
        const br = await axios.post(
          endpoint,
          {
            modelId: 'amazon.nova-pro-v1:0',
            messages: [ { role: 'user', content: [{ text: prompt }] } ],
            inferenceConfig: { temperature: 0.2 }
          },
          { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${bedrockApiKey}` }, timeout: 60000 }
        );
        responseText = br?.data?.output?.message?.content?.[0]?.text || br?.data?.content || '';
      } catch (e) {
        // Fallback to SDK if API key path fails
        const client = new BedrockRuntimeClient({
          region,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
          },
        });
        const sdkRes = await client.send(new ConverseCommand({
          modelId: 'amazon.nova-pro-v1:0',
          messages: [ { role: 'user', content: [{ text: prompt }] } ],
          inferenceConfig: { temperature: 0.2 }
        }));
        responseText = sdkRes?.output?.message?.content?.[0]?.text || '';
      }
    } else {
      // SDK-only path
      const client = new BedrockRuntimeClient({
        region,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
          sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
        },
      });
      const sdkRes = await client.send(new ConverseCommand({
        modelId: 'amazon.nova-pro-v1:0',
        messages: [ { role: 'user', content: [{ text: prompt }] } ],
        inferenceConfig: { temperature: 0.2 }
      }));
      responseText = sdkRes?.output?.message?.content?.[0]?.text || '';
    }

    // Parse JSON safely
    let structured;
    try {
      structured = JSON.parse(responseText);
    } catch (err) {
      return res.status(500).json({ message: "Failed to parse AI response", raw: responseText });
    }

    // Save to DB (defensive defaults)
    project.description = structured.description || project.description || "";
    project.milestones = Array.isArray(structured.milestones) ? structured.milestones : [];
    project.blueprint = Array.isArray(structured.blueprint) ? structured.blueprint : [];
    project.completedMilestones = (project.milestones || []).filter(m => m.completed).length;
    project.isCompleted = project.milestones.length > 0 && project.completedMilestones === project.milestones.length;
    project.progress = project.milestones.length > 0 ? Math.round((project.completedMilestones / project.milestones.length) * 100) : 0;
    await project.save();

    res.json({ message: "Generated successfully", project });
  } catch (err) {
    console.error("Error generating project blueprint:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update milestone progress (legacy single toggle)
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

// Patch project (milestones/progress updates from UI)
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { milestones, completedMilestones, progress, currentMilestone, description, blueprint } = req.body;

    if (Array.isArray(milestones)) project.milestones = milestones;
    if (typeof completedMilestones === 'number') project.completedMilestones = completedMilestones;
    if (typeof progress === 'number') project.progress = Math.max(0, Math.min(100, progress));
    if (typeof currentMilestone === 'string') project.currentMilestone = currentMilestone;
    if (typeof description === 'string') project.description = description;
    if (Array.isArray(blueprint)) project.blueprint = blueprint;

    // Recompute booleans
    project.isCompleted = project.milestones.length > 0 && project.completedMilestones === project.milestones.length;

    await project.save();
    res.json({ message: 'Project updated', project });
  } catch (err) {
    console.error('Error patching project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Minimal chat endpoints
router.get('/:id/chat', verifyToken, async (req, res) => {
  // For simplicity, return empty; could be extended with a Message model
  res.json({ messages: [] });
});

router.post('/:id/chat', verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'message is required' });

    // Simple AI echo guidance using project context
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are an AI mentor helping with a project titled "${project.title}" using ${project.techStack.join(', ')}. User asked: ${message}. Respond concisely (max 120 words).`;
    const result = await model.generateContent(prompt);
    const aiMessage = result.response.text();
    res.json({ aiMessage });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Analytics endpoint (dynamic based on user and project data)
router.get('/:id/analytics', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // User context
    const userId = req.user?.id;
    const userRole = req.user?.role || 'user';
    const username = req.user?.username || 'User';

    // Aggregate simple user signals
    let userProjectsCount = 0;
    if (userId) {
      try {
        const user = await User.findById(userId).select('projects').populate({ path: 'projects', select: '_id' });
        userProjectsCount = Array.isArray(user?.projects) ? user.projects.length : 0;
      } catch (_) {
        userProjectsCount = 0;
      }
    }

    // Project signals
    const milestones = Array.isArray(project.milestones) ? project.milestones : [];
    const totalMilestones = milestones.length;
    const completedMilestones = Number(project.completedMilestones || 0);
    const progressPct = Number(project.progress || 0);
    const descriptionLength = typeof project.description === 'string' ? project.description.length : 0;
    const techStackCount = Array.isArray(project.techStack) ? project.techStack.length : 0;
    const edges = Array.isArray(project.blueprint) ? project.blueprint : [];
    const blueprintEdges = edges.length;
    const nodeSet = new Set();
    edges.forEach(e => { if (e?.from) nodeSet.add(String(e.from)); if (e?.to) nodeSet.add(String(e.to)); });
    const uniqueNodes = nodeSet.size;

    // Helper clamp
    const clamp = (val, min, max) => Math.max(min, Math.min(max, Math.round(val)));

    // Maintainability heuristic: progress, documentation richness, architectural clarity, reasonable stack size
    const maintainabilityBase = 40;
    const progressContribution = (progressPct / 100) * 30; // up to +30
    const docsContribution = Math.min(30, Math.floor(descriptionLength / 200)); // up to +30 for longer descriptions
    const stackSweetSpot = 5; // encourage moderate stack size
    const stackPenalty = Math.max(0, Math.min(10, Math.abs(techStackCount - stackSweetSpot) * 2));
    const nodeClarity = Math.min(10, uniqueNodes / 2); // more nodes up to +10
    const maintainability = clamp(maintainabilityBase + progressContribution + docsContribution + nodeClarity - stackPenalty, 10, 100);

    // Performance heuristic: simpler graphs & progress indicate better performance; user experience gives small boost
    const perfBase = 50;
    const nodeSimplicity = (1 - Math.min(1, uniqueNodes / 15)) * 15; // up to +15
    const edgeSimplicity = (1 - Math.min(1, blueprintEdges / 20)) * 15; // up to +15
    const progressPerf = (progressPct / 100) * 10; // up to +10
    const userBoost = Math.min(10, userProjectsCount * 1); // small boost for experienced users
    const roleBoost = userRole === 'admin' ? 5 : 0;
    const performance = clamp(perfBase + nodeSimplicity + edgeSimplicity + progressPerf + userBoost + roleBoost, 10, 100);

    // Test coverage: proportion of completed milestones and presence of testing-oriented milestones
    const testsMentioned = milestones.filter(m => /test|coverage|qa|ci\b/i.test(`${m?.title || ''} ${m?.description || ''}`)).length;
    const testsSignal = totalMilestones > 0 ? Math.min(20, (testsMentioned / totalMilestones) * 40) : 0; // up to +20
    const completionSignal = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 80 : (progressPct * 0.6); // up to +80
    const testCoverage = clamp(completionSignal + testsSignal, 0, 100);

    // Package metrics (proxy): scale with tech stack and user activity; fewer outdated as milestones complete
    const totalPackages = Math.max(10, Math.min(200, 20 + techStackCount * 6 + userProjectsCount * 3 + Math.floor(uniqueNodes * 0.5)));
    const outdatedPackages = clamp(totalPackages * 0.12 - completedMilestones * 0.5, 0, totalPackages);
    const vulnerabilities = clamp(totalPackages * 0.02 - (userRole === 'admin' ? 1 : 0), 0, Math.max(3, Math.floor(totalPackages * 0.05)));

    res.json({
      maintainability,
      performance,
      testCoverage,
      totalPackages,
      outdatedPackages,
      vulnerabilities,
      user: { username, role: userRole, projects: userProjectsCount }
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
