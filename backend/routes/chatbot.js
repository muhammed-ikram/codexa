const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const { GoogleGenerativeAI } = require('@google/generative-ai');
require("dotenv").config();

const router = express.Router();

// Initialize Gemini AI
if (!process.env.GEMINI_API_KEY) {
  console.error("Missing Gemini API Key in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat with AI assistant
router.post("/", verifyToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: "Message is required" });
    }

    const prompt = `
You are a friendly and knowledgeable **project mentor chatbot** for engineering students. 
Your users are usually strong in theory but lack practical project development skills.  

When responding to students:  
1. Break complex project concepts into **simple, beginner-friendly steps**.  
2. Suggest **real-world project ideas** (web apps, IoT, AI, embedded systems, etc.) that match their theoretical background.  
3. Give **hands-on guidance**: explain what tools, frameworks, or technologies they should start with.  
4. Provide **clear learning paths** (e.g., “first learn Git basics, then try building a small React app”).  
5. Encourage them and build confidence — remind them that even small projects matter.  
6. Keep responses **practical, motivational, and under 200 words**.  

Student asks: "${message}"  
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    if (!response || response.trim().length === 0) {
      throw new Error("Empty response from AI");
    }

    res.json({
      message: "AI response generated successfully",
      userMessage: message,
      aiResponse: response.trim()
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ 
      message: "Sorry, something went wrong. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

module.exports = router;
