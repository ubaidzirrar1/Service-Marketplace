
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function searchServices(query: string, location?: { lat: number; lng: number }) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find local service categories and top providers for: "${query}" near ${location ? `${location.lat}, ${location.lng}` : 'current location'}. Suggest relevant categories.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text,
      links: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web?.uri).filter(Boolean) || []
    };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return null;
  }
}

export async function generateProfessionalBio(name: string, category: string, skills: string[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a professional, catchy, and trust-building bio for a service marketplace profile. 
      Name: ${name}
      Category: ${category}
      Skills: ${skills.join(', ')}
      Keep it between 150-250 characters. Write it in first person.`,
    });
    return response.text;
  } catch (error) {
    console.error("Bio Generation Error:", error);
    return "Failed to generate bio. Please try again.";
  }
}

export async function optimizeJobDescription(title: string, roughDescription: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Optimize this job description for a service marketplace to attract high-quality professionals.
      Title: ${title}
      Draft: ${roughDescription}
      Make it professional, list clear requirements, and keep it concise.`,
    });
    return response.text;
  } catch (error) {
    console.error("Job Optimization Error:", error);
    return roughDescription;
  }
}

export async function getLocalInsights(lat: number, lng: number) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "What are the most in-demand local services and market trends at these coordinates?",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });
    return response.text;
  } catch (error) {
    return "Local market data temporarily unavailable.";
  }
}
