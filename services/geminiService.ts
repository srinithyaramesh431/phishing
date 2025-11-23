
import { GoogleGenAI, Type } from "@google/genai";
import { Classification } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. The app will not function correctly without a valid API key.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    classification: {
      type: Type.STRING,
      description: 'The classification of the email. Must be one of: "Safe", "Suspicious", or "Phishing".',
      enum: [Classification.SAFE, Classification.SUSPICIOUS, Classification.PHISHING]
    },
    reason: {
      type: Type.STRING,
      description: 'A brief, one-sentence explanation for the classification provided.'
    }
  },
  required: ['classification', 'reason']
};

export const analyzeEmailContent = async (content: string): Promise<{ classification: Classification; reason: string } | null> => {
  if (!content || content.trim().length < 50) {
    // Basic validation to avoid sending empty or tiny prompts
    throw new Error("Content is too short to analyze.");
  }
  
  try {
    const prompt = `Analyze the following email content for phishing indicators. Scrutinize links, sender information, urgency, and language. Classify it strictly as "Safe", "Suspicious", or "Phishing" and provide a concise, one-sentence reason for your classification.

    Email content:
    ---
    ${content}
    ---
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
        temperature: 0,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (Object.values(Classification).includes(result.classification) && result.reason) {
      return {
        classification: result.classification as Classification,
        reason: result.reason,
      };
    } else {
      console.error("Invalid response structure from API:", result);
      return null;
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
};
