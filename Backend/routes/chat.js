import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

router.post("/", async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const { messages } = req.body; 
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: "Messages array is required" });
  }

  try {
    
    const conversation = messages.map((msg, index) => 
      `${index % 2 === 0 ? "User" : "Bot"}: ${msg}`).join("\n");

    const result = await model.generateContent(conversation);
    const botResponse = result.response.text();

    return res.status(200).json({ response: botResponse });
  } catch (error) {
    console.error("Error generating content:", error);
    return res.status(500).json({ message: "Failed to generate content" });
  }
});

export default router;
