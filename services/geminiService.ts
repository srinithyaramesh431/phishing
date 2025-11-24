import { GoogleGenAI, Type } from "@google/genai";
import { Classification } from '../types';

// Helper to safely access environment variables in various environments (Vite, Next.js, etc.)
const getApiKey = (): string | undefined => {
  // Check for Vite environment variable (standard for this project structure)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  // Check for standard process.env (if polyfilled or Node.js)
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  return undefined;
};

const apiKey = getApiKey();

// Initialize AI instance only if key is present to avoid immediate crash
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

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

export const analyzeEmailContent = async (content: string): Promise<{ classification: Classification; reason: string }> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please set VITE_API_KEY in your environment variables.");
  }

  // Check if the user mistakenly provided an OpenAI key
  if (apiKey.startsWith('sk-')) {
    throw new Error("Incorrect API Key detected. It looks like you are using an OpenAI key (starting with 'sk-'), but this application requires a Google Gemini API Key.");
  }

  if (!ai) {
     throw new Error("Gemini AI client failed to initialize.");
  }

  if (!content || content.trim().length < 10) {
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
      throw new Error("Received invalid response format from AI.");
    }
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    if (error.message && (error.message.includes('403') || error.message.includes('key'))) {
        throw new Error("API Permission Denied. Check your API Key.");
    }
    throw new Error(error.message || "Failed to analyze email. Please try again.");
  }
};