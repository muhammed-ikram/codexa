const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Project = require("../models/Project");
require("dotenv").config();

const router = express.Router();

// Initialize Gemini AI with GEMINI_API_KEY_2
if (!process.env.GEMINI_API_KEY_2) {
  console.error("Missing GEMINI_API_KEY_2 in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_2);

// POST /api/ai-mentor/:projectId/chat
router.post("/:projectId/chat", verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { message, openFile } = req.body || {};

    if (!message || String(message).trim().length === 0) {
      return res.status(400).json({ message: "Message is required" });
    }

    const project = await Project.findById(projectId).lean();
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const techStack = Array.isArray(project.techStack) ? project.techStack : [];
    const milestones = Array.isArray(project.milestones) ? project.milestones : [];
    const currentProgress = Number(project.progress || 0);
    const currentMilestone = milestones.find(m => m && m.completed === false) || milestones.find(m => m) || null;

    const openFilePath = openFile?.path || '';
    const openFileLanguage = openFile?.language || '';
    const openFileContent = openFile?.content || '';

    // System prompt guiding the behavior
    const guidance = `
You are Codexa's AI Mentor for practical project guidance.

Objectives:
- Primary: Answer the student's question directly and help them make tangible progress.
- Tailor advice to the project's tech stack and the current milestone.
- Teach a step-by-step approach, referencing their existing code in the currently opened file when useful.
- IMPORTANT: Only include code snippets if the user explicitly asks for code. If not asked, describe what to change and where.

Formatting rules:
- Use short sections with clear headings and numbered steps.
- If you include code (only when asked), wrap it in fenced blocks with the correct language, like \n\`\`\`js\n...\n\`\`\`\n so the UI can render a copy button.
- Keep responses focused, practical, and actionable.

Teaching requirement:
- From the opened file's content and the project context, infer the major concepts, libraries, or primitives the student will use to complete the task (e.g., JWT authentication, REST routes, middleware, React hooks/state, CSS Flexbox/Grid, async/await, form validation, database queries, etc.).
- For each relevant major concept (limit to the 2–3 most important), add a short "Concept Primer" section that explains:
  1) What it is and why it matters here
  2) How to apply it specifically in this file/context
  3) Common pitfalls
- Do NOT include code in the primer unless the student explicitly asked for code; otherwise describe the steps and where they would go.
`;

    const projectContext = `
Project Context:
- Title: ${project.title || project.name || 'Untitled'}
- Tech Stack: ${techStack.map(t => typeof t === 'string' ? t : (t?.name || t?.label || '')).filter(Boolean).join(', ') || 'N/A'}
- Progress: ${currentProgress}%
- Current Milestone: ${currentMilestone ? `${currentMilestone.title || ''}${currentMilestone.description ? ' — ' + currentMilestone.description : ''}` : 'N/A'}
`;

    const fileContext = openFilePath ? `
Opened File:
- Path: ${openFilePath}
- Language: ${openFileLanguage}
- Content (may be truncated):\n${openFileContent.slice(0, 6000)}
` : 'Opened File: None provided by client';

    const userQuery = `
Student Question:
${message}
`;

    const prompt = `${guidance}\n\n${projectContext}\n\n${fileContext}\n\n${userQuery}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const aiText = (await result.response.text()).trim();

    if (!aiText) {
      return res.status(500).json({ message: 'Empty response from AI' });
    }

    return res.json({
      aiMessage: aiText,
    });
  } catch (err) {
    console.error('AI Mentor route error:', err);
    return res.status(500).json({ message: 'Failed to generate mentor response' });
  }
});

module.exports = router;


