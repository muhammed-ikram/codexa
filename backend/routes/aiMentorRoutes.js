const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');
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

    // Use Amazon Bedrock for AI Mentor chat (keeps the same prompt and response contract)
    const region = process.env.AWS_REGION || process.env.BEDROCK_REGION || 'us-east-1';
    const bedrockApiKey = process.env.BEDROCK_API_KEY;
    let aiText = '';

    if (bedrockApiKey) {
      try {
        const endpoint = process.env.BEDROCK_ENDPOINT || `https://bedrock-runtime.${region}.amazonaws.com/model/amazon.nova-pro-v1:0/converse`;
        const resp = await axios.post(
          endpoint,
          {
            modelId: 'amazon.nova-pro-v1:0',
            messages: [ { role: 'user', content: [{ text: prompt }] } ],
            inferenceConfig: { temperature: 0.4 }
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${bedrockApiKey}`
            },
            timeout: 30000
          }
        );
        aiText = (resp?.data?.output?.message?.content?.[0]?.text || resp?.data?.content || '').trim();
      } catch (apiErr) {
        // Fallback to SDK credentials if API key path fails
        try {
          const client = new BedrockRuntimeClient({
            region,
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
              sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
            },
          });
          const sdkResp = await client.send(new ConverseCommand({
            modelId: 'amazon.nova-pro-v1:0',
            messages: [ { role: 'user', content: [{ text: prompt }] } ],
            inferenceConfig: { temperature: 0.4 }
          }));
          aiText = (sdkResp?.output?.message?.content?.[0]?.text || '').trim();
        } catch (sdkErr) {
          throw apiErr;
        }
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
      const sdkResp = await client.send(new ConverseCommand({
        modelId: 'amazon.nova-pro-v1:0',
        messages: [ { role: 'user', content: [{ text: prompt }] } ],
        inferenceConfig: { temperature: 0.4 }
      }));
      aiText = (sdkResp?.output?.message?.content?.[0]?.text || '').trim();
    }

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

// POST /api/ai-mentor/stack/suggest
router.post("/stack/suggest", verifyToken, async (req, res) => {
  try {
    const { title } = req.body || {};
    if (!title || String(title).trim().length === 0) {
      return res.status(400).json({ message: "Title is required" });
    }

    const system = `
You generate concise, modern tech stacks for new software projects based on the title only.
Return a short list (6-10 items) across frontend, backend, database, auth, styling/build, and hosting/realtime if relevant.
Prefer widely-used, beginner-friendly, production-ready choices.
Output strictly as a single JSON array of strings, no comments, no prose.`;

    const user = `
Project title: ${title}
Return JSON array only.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(`${system}\n\n${user}`);
    const raw = (await result.response.text()).trim();

    // Attempt to extract JSON array
    let suggestions = [];
    try {
      const jsonStart = raw.indexOf('[');
      const jsonEnd = raw.lastIndexOf(']');
      const json = jsonStart !== -1 && jsonEnd !== -1 ? raw.slice(jsonStart, jsonEnd + 1) : raw;
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) suggestions = parsed.map(v => (typeof v === 'string' ? v.trim() : '')).filter(Boolean);
    } catch (_) {
      // fallback: split by commas
      suggestions = raw
        .replace(/\n/g, ' ')
        .split(',')
        .map(s => s.replace(/[\[\]\"\']/g, '').trim())
        .filter(Boolean);
    }

    // Basic sanitize and de-dup
    const uniq = Array.from(new Set(suggestions)).slice(0, 12);

    return res.json({ suggestions: uniq });
  } catch (err) {
    console.error('AI Mentor stack suggest error:', err);
    return res.status(500).json({ message: 'Failed to suggest tech stack' });
  }
});



// POST /api/ai-mentor/learning/suggest (OpenAI)
router.post("/learning/suggest", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Derive lightweight user context from recent projects
    let projects = [];
    try {
      projects = await Project.find({}).sort({ updatedAt: -1 }).limit(10).lean();
    } catch (_) {}

    const techCounts = {};
    (projects || []).forEach(p => (p.techStack || []).forEach(t => {
      const key = typeof t === 'string' ? t : (t?.name || t?.label || 'Tech');
      techCounts[key] = (techCounts[key] || 0) + 1;
    }));
    const topTech = Object.entries(techCounts).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k])=>k);

    const context = {
      topTech,
      projects: (projects || []).map(p => ({ title: p.title || p.name, techStack: p.techStack || [], progress: p.progress || 0 }))
    };

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ message: 'Missing OPENAI_API_KEY' });

    const systemMsg = 'You are a helpful learning curator. Return valid JSON only, no prose.';
    const userPrompt = `
Given this user's recent projects and most-used technologies, recommend up-to-date learning resources (YouTube videos, blogs, docs, courses).
Focus on technologies the user likely needs to strengthen. Provide 6–10 curated items grouped by technology/topic with concise titles and links.
Avoid generic content; prioritize high-quality, beginner-to-intermediate friendly materials.
Output JSON exactly as: { "groups": [ { "topic": string, "items": [ { "title": string, "url": string, "type": "video"|"blog"|"docs"|"course", "reason": string } ] } ] }

User context (approx.):
${JSON.stringify(context)}
`;

    let content = '';
    try {
      const resp = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          temperature: 0.2,
          messages: [
            { role: 'system', content: systemMsg },
            { role: 'user', content: userPrompt }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );
      content = resp?.data?.choices?.[0]?.message?.content || '';
    } catch (openAiErr) {
      // Fallback to Gemini if OpenAI is unavailable or free tier blocked
      try {
        if (!process.env.GEMINI_API_KEY_2) throw openAiErr;
        const genModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const geminiPrompt = `${systemMsg}\n\n${userPrompt}`;
        const gemRes = await genModel.generateContent(geminiPrompt);
        content = (await gemRes.response.text()) || '';
      } catch (_) {
        // If fallback also fails, rethrow original
        throw openAiErr;
      }
    }
    let data;
    try {
      const start = content.indexOf('{');
      const end = content.lastIndexOf('}');
      const json = start !== -1 && end !== -1 ? content.slice(start, end + 1) : content;
      data = JSON.parse(json);
    } catch (_) {
      data = { groups: [] };
    }

    return res.json({ suggestions: data });
  } catch (err) {
    console.error('AI Mentor learning suggest error:', err?.response?.data || err);
    return res.status(500).json({ message: 'Failed to fetch learning suggestions. Ensure your API key has access or try again later.' });
  }
});

// POST /api/ai-mentor/launch/recommend — AWS Bedrock (Nova Pro)
router.post('/launch/recommend', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.body || {};
    if (!projectId) return res.status(400).json({ message: 'projectId is required' });

    const project = await Project.findById(projectId).lean();
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const techStack = (project.techStack || []).map(t => typeof t === 'string' ? t : (t?.name || t?.label || '')).filter(Boolean);
    const description = project.description || '';

    const system = 'You are an expert cloud deployment advisor. Return valid JSON only.';
    const user = `
Project Title: ${project.title || project.name || 'Untitled'}
Tech Stack: ${techStack.join(', ') || 'N/A'}
Description: ${description}

Task: Suggest practical deployment options and recommendations based on the stack, cost, scalability, CI/CD, and developer experience.
Output strictly as JSON: {
  "recommendations": [
    {
      "platform": string,
      "logo": string, // emoji or glyph
      "cost": string,
      "pros": string[],
      "cons": string[],
      "isRecommended": boolean
    }
  ]
}`;

    const region = process.env.AWS_REGION || process.env.BEDROCK_REGION || 'us-east-1';
    let content = '';

    // Prefer API Key flow if provided
    const bedrockApiKey = process.env.BEDROCK_API_KEY;
    if (bedrockApiKey) {
      try {
        const endpoint = process.env.BEDROCK_ENDPOINT || `https://bedrock-runtime.${region}.amazonaws.com/model/amazon.nova-pro-v1:0/converse`;
        const resp = await axios.post(
          endpoint,
          {
            modelId: 'amazon.nova-pro-v1:0',
            messages: [
              { role: 'user', content: [{ text: `${system}\n\n${user}` }] }
            ],
            inferenceConfig: { temperature: 0.2 }
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${bedrockApiKey}`
            },
            timeout: 30000
          }
        );
        // Align with SDK-like shape if possible
        content = resp?.data?.output?.message?.content?.[0]?.text || resp?.data?.content || '';
      } catch (err) {
        console.error('Bedrock (API key) converse error:', err?.response?.data || err?.message || err);
        // Fall back to SDK if configured
        try {
          const client = new BedrockRuntimeClient({
            region,
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
              sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
            },
          });
          const sdkResp = await client.send(new ConverseCommand({
            modelId: 'amazon.nova-pro-v1:0',
            messages: [
              { role: 'user', content: [{ text: `${system}\n\n${user}` }] }
            ],
            inferenceConfig: { temperature: 0.2 }
          }));
          content = sdkResp?.output?.message?.content?.[0]?.text || '';
        } catch (sdkErr) {
          const name = sdkErr?.name || 'Error';
          console.error('Bedrock SDK Converse error (fallback):', name, sdkErr?.message || String(sdkErr));
          return res.status(500).json({ message: `Failed to generate recommendations via Bedrock` });
        }
      }
    } else {
      // SDK path only
      try {
        const client = new BedrockRuntimeClient({
          region,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
          },
        });
        const resp = await client.send(new ConverseCommand({
          modelId: 'amazon.nova-pro-v1:0',
          messages: [
            { role: 'user', content: [{ text: `${system}\n\n${user}` }] }
          ],
          inferenceConfig: { temperature: 0.2 }
        }));
        content = resp?.output?.message?.content?.[0]?.text || '';
      } catch (err) {
        const name = err?.name || 'Error';
        const message = err?.message || String(err);
        console.error('Bedrock Converse error:', name, message);
        return res.status(500).json({ message: `Failed to generate recommendations via Bedrock: ${name}` });
      }
    }

    let data;
    try {
      const start = content.indexOf('{');
      const end = content.lastIndexOf('}');
      const json = start !== -1 && end !== -1 ? content.slice(start, end + 1) : content;
      data = JSON.parse(json);
      if (!Array.isArray(data.recommendations)) throw new Error('Invalid JSON');
    } catch (_) {
      data = { recommendations: [] };
    }

    return res.json(data);
  } catch (err) {
    console.error('Launch recommend error:', err);
    return res.status(500).json({ message: 'Failed to generate launch recommendations' });
  }
});

// GET /api/ai-mentor/interview/question — Generate interview question from user's top tech
router.get('/interview/question', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Use recent projects to infer top technologies
    let projects = [];
    try {
      projects = await Project.find({}).sort({ updatedAt: -1 }).limit(20).lean();
    } catch (_) {}

    const techCounts = {};
    (projects || []).forEach(p => (p.techStack || []).forEach(t => {
      const key = typeof t === 'string' ? t : (t?.name || t?.label || 'Tech');
      techCounts[key] = (techCounts[key] || 0) + 1;
    }));
    const topTech = Object.entries(techCounts).sort((a,b)=>b[1]-a[1]).map(([k])=>k);
    const pool = topTech.slice(0, Math.max(1, Math.min(5, topTech.length)));
    const primary = pool.length ? pool[Math.floor(Math.random() * pool.length)] : 'Web Development';

    // Add a nonce to encourage variation across requests even with similar context
    const nonce = `#${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

    const system = 'You are an expert technical interviewer. Return valid JSON only.';
    const user = `
Create one interview-style question focused on the candidate's most-used technology.
Technology: ${primary}
Constraints: The question should be clear, concise, assess practical understanding, and be different from prior outputs. Vary topic angles and difficulty (easy/medium). Avoid repeating wording. ${nonce}
Output JSON exactly as: { "topic": string, "question": string }`;

    const region = process.env.AWS_REGION || process.env.BEDROCK_REGION || 'us-east-1';
    const bedrockApiKey = process.env.BEDROCK_API_KEY;
    let content = '';

    if (bedrockApiKey) {
      try {
        const endpoint = process.env.BEDROCK_ENDPOINT || `https://bedrock-runtime.${region}.amazonaws.com/model/amazon.nova-pro-v1:0/converse`;
        const resp = await axios.post(
          endpoint,
          {
            modelId: 'amazon.nova-pro-v1:0',
            messages: [ { role: 'user', content: [{ text: `${system}\n\n${user}` }] } ],
            inferenceConfig: { temperature: 0.7 }
          },
          { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${bedrockApiKey}` }, timeout: 30000 }
        );
        content = resp?.data?.output?.message?.content?.[0]?.text || resp?.data?.content || '';
      } catch (apiErr) {
        // Fallback to SDK
        const client = new BedrockRuntimeClient({
          region,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
          },
        });
        const sdkResp = await client.send(new ConverseCommand({
          modelId: 'amazon.nova-pro-v1:0',
          messages: [ { role: 'user', content: [{ text: `${system}\n\n${user}` }] } ],
          inferenceConfig: { temperature: 0.7 }
        }));
        content = sdkResp?.output?.message?.content?.[0]?.text || '';
      }
    } else {
      const client = new BedrockRuntimeClient({
        region,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
          sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
        },
      });
      const sdkResp = await client.send(new ConverseCommand({
        modelId: 'amazon.nova-pro-v1:0',
        messages: [ { role: 'user', content: [{ text: `${system}\n\n${user}` }] } ],
        inferenceConfig: { temperature: 0.7 }
      }));
      content = sdkResp?.output?.message?.content?.[0]?.text || '';
    }

    let data;
    try {
      const start = content.indexOf('{');
      const end = content.lastIndexOf('}');
      const json = start !== -1 && end !== -1 ? content.slice(start, end + 1) : content;
      data = JSON.parse(json);
      if (!data || !data.question) throw new Error('bad');
    } catch (_) {
      data = { topic: primary, question: `What are core principles of ${primary}?` };
    }

    return res.json(data);
  } catch (err) {
    console.error('Interview question error:', err);
    return res.status(500).json({ message: 'Failed to generate interview question' });
  }
});

// POST /api/ai-mentor/interview/evaluate — Evaluate answer; return yes/no and correct answer
router.post('/interview/evaluate', verifyToken, async (req, res) => {
  try {
    const { topic, question, answer } = req.body || {};
    if (!question || !answer) return res.status(400).json({ message: 'question and answer are required' });

    const system = 'You are a strict technical interviewer. Return valid JSON only. Do not include any extra text.';
    const user = `Evaluate the candidate's answer. If correct, return { "correct": true, "feedback": string }. If not, return { "correct": false, "feedback": string, "correctAnswer": string }. Keep feedback concise and actionable.\n\nTopic: ${topic || 'General'}\nQuestion: ${question}\nCandidate Answer: ${answer}`;

    const region = process.env.AWS_REGION || process.env.BEDROCK_REGION || 'us-east-1';
    const bedrockApiKey = process.env.BEDROCK_API_KEY;
    let content = '';

    if (bedrockApiKey) {
      try {
        const endpoint = process.env.BEDROCK_ENDPOINT || `https://bedrock-runtime.${region}.amazonaws.com/model/amazon.nova-pro-v1:0/converse`;
        const resp = await axios.post(
          endpoint,
          {
            modelId: 'amazon.nova-pro-v1:0',
            messages: [ { role: 'user', content: [{ text: `${system}\n\n${user}` }] } ],
            inferenceConfig: { temperature: 0.2 }
          },
          { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${bedrockApiKey}` }, timeout: 30000 }
        );
        content = resp?.data?.output?.message?.content?.[0]?.text || resp?.data?.content || '';
      } catch (apiErr) {
        const client = new BedrockRuntimeClient({
          region,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
          },
        });
        const sdkResp = await client.send(new ConverseCommand({
          modelId: 'amazon.nova-pro-v1:0',
          messages: [ { role: 'user', content: [{ text: `${system}\n\n${user}` }] } ],
          inferenceConfig: { temperature: 0.2 }
        }));
        content = sdkResp?.output?.message?.content?.[0]?.text || '';
      }
    } else {
      const client = new BedrockRuntimeClient({
        region,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
          sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
        },
      });
      const sdkResp = await client.send(new ConverseCommand({
        modelId: 'amazon.nova-pro-v1:0',
        messages: [ { role: 'user', content: [{ text: `${system}\n\n${user}` }] } ],
        inferenceConfig: { temperature: 0.2 }
      }));
      content = sdkResp?.output?.message?.content?.[0]?.text || '';
    }

    let data;
    const attemptParse = (txt) => {
      try {
        const start = txt.indexOf('{');
        const end = txt.lastIndexOf('}');
        const json = start !== -1 && end !== -1 ? txt.slice(start, end + 1) : txt;
        const parsed = JSON.parse(json);
        return parsed;
      } catch (_) {
        return null;
      }
    };

    data = attemptParse(content);

    // Second pass: if missing or malformed, ask model to reformat strictly as JSON
    if (!data || typeof data.correct !== 'boolean') {
      const enforceSystem = 'Return ONLY a valid JSON object. No prose, no code fences, no markdown.';
      const enforceUser = `Re-evaluate strictly and return JSON matching exactly one of: { "correct": true, "feedback": string } OR { "correct": false, "feedback": string, "correctAnswer": string }.\n\nTopic: ${topic || 'General'}\nQuestion: ${question}\nCandidate Answer: ${answer}`;

      try {
        if (bedrockApiKey) {
          const endpoint2 = process.env.BEDROCK_ENDPOINT || `https://bedrock-runtime.${region}.amazonaws.com/model/amazon.nova-pro-v1:0/converse`;
          const resp2 = await axios.post(
            endpoint2,
            {
              modelId: 'amazon.nova-pro-v1:0',
              messages: [ { role: 'user', content: [{ text: `${enforceSystem}\n\n${enforceUser}` }] } ],
              inferenceConfig: { temperature: 0.1 }
            },
            { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${bedrockApiKey}` }, timeout: 30000 }
          );
          content = resp2?.data?.output?.message?.content?.[0]?.text || resp2?.data?.content || '';
        } else {
          const client2 = new BedrockRuntimeClient({
            region,
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
              sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
            },
          });
          const sdkResp2 = await client2.send(new ConverseCommand({
            modelId: 'amazon.nova-pro-v1:0',
            messages: [ { role: 'user', content: [{ text: `${enforceSystem}\n\n${enforceUser}` }] } ],
            inferenceConfig: { temperature: 0.1 }
          }));
          content = sdkResp2?.output?.message?.content?.[0]?.text || '';
        }
      } catch (_) {}

      data = attemptParse(content) || data;
    }

    // Final fallback heuristic
    if (!data || typeof data.correct !== 'boolean') {
      const lower = String(content || '').toLowerCase();
      const isCorrect = /\b(correct|yes|true)\b/.test(lower) && !/\b(incorrect|no|false)\b/.test(lower);
      data = { correct: !!isCorrect, feedback: isCorrect ? 'Good answer.' : 'Answer appears incorrect.', correctAnswer: isCorrect ? undefined : undefined };
    }

    return res.json(data);
  } catch (err) {
    console.error('Interview evaluate error:', err);
    return res.status(500).json({ message: 'Failed to evaluate answer' });
  }
});

module.exports = router;
