const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const axios = require('axios');
const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');
require("dotenv").config();

const router = express.Router();

// Bedrock settings
const BEDROCK_REGION = process.env.AWS_REGION || process.env.BEDROCK_REGION || 'us-east-1';

// Chat with AI assistant
router.post("/", verifyToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: "Message is required" });
    }

    const system = `You are a friendly and knowledgeable project mentor chatbot for engineering students. Keep responses practical, motivational, and under 200 words.`;
    const user = `
When responding to students:
1. Break complex project concepts into simple, beginner-friendly steps.
2. Suggest real-world project ideas that match their theoretical background.
3. Give hands-on guidance on tools/frameworks to start with.
4. Provide clear learning paths (e.g., first learn Git basics, then build a small React app).
5. Encourage them and build confidence — even small projects matter.

Student asks: "${message}"
`;

    const bedrockApiKey = process.env.BEDROCK_API_KEY;
    const region = BEDROCK_REGION;
    let response = '';

    if (bedrockApiKey) {
      try {
        const endpoint = process.env.BEDROCK_ENDPOINT || `https://bedrock-runtime.${region}.amazonaws.com/model/amazon.nova-pro-v1:0/converse`;
        const apiResp = await axios.post(
          endpoint,
          {
            modelId: 'amazon.nova-pro-v1:0',
            messages: [
              { role: 'user', content: [{ text: `${system}\n\n${user}` }] }
            ],
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
        response = apiResp?.data?.output?.message?.content?.[0]?.text || apiResp?.data?.content || '';
      } catch (apiErr) {
        // Fallback to SDK creds if available
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
            inferenceConfig: { temperature: 0.4 }
          }));
          response = sdkResp?.output?.message?.content?.[0]?.text || '';
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
        messages: [
          { role: 'user', content: [{ text: `${system}\n\n${user}` }] }
        ],
        inferenceConfig: { temperature: 0.4 }
      }));
      response = sdkResp?.output?.message?.content?.[0]?.text || '';
    }

    if (!response || String(response).trim().length === 0) {
      throw new Error("Empty response from AI");
    }

    res.json({
      message: "AI response generated successfully",
      userMessage: message,
      aiResponse: String(response).trim()
    });
  } catch (error) {
    console.error("Chatbot error:", error?.response?.data || error?.message || error);
    res.status(500).json({ 
      message: "Sorry, something went wrong. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

module.exports = router;
