const { GoogleGenAI } = require("@google/genai");
const { envConfig } = require('../config/env');

class AIService {
  constructor() {
    // The client gets the API key from the environment variable GEMINI_API_KEY
    this.ai = new GoogleGenAI({});
  }

  /**
   * Process user's natural language request to extract booking information
   * @param {string} userMessage - User's description of their problem
   * @param {string} userLocation - User's location (optional)
   * @returns {Promise<Object>} Extracted booking details
   */
  async processBookingRequest(userMessage, userLocation = '') {
    // Check if API key is configured
    if (!envConfig.geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file. Get your key from https://aistudio.google.com/apikey');
    }
    
    try {
      const prompt = `You are a helpful booking assistant for Urban Skill, a service marketplace platform.
      
A user needs help booking a service worker. Analyze their request and extract the following information in JSON format:

User's Request: "${userMessage}"
${userLocation ? `User's Location: "${userLocation}"` : ''}

Extract and return ONLY a valid JSON object with these fields:
{
  "serviceType": "one of: plumber, electrician, carpenter, painter, cleaner, gardener, mechanic, appliance-repair, pest-control, other",
  "problemDescription": "clear description of the problem",
  "urgency": "low, medium, high, or emergency",
  "hasSafetyRisk": true or false,
  "estimatedDuration": "in hours (e.g., 1-2, 2-4)",
  "preferredTimeframe": "today, tomorrow, this-week, flexible",
  "specialRequirements": ["list any special tools, expertise, or requirements mentioned"],
  "keywords": ["key terms for matching workers"],
  "confidence": number between 0 and 1
}

Important Guidelines:
- Detect urgency from words like: urgent, emergency, asap, broken, leaking, dangerous
- Safety risks: electrical sparks, gas leaks, water flooding, structural damage
- Be specific about service type - if unclear, choose "other"
- Extract concrete details from the user's message
- If the user's request is vague, mark confidence as low

Return ONLY the JSON object, no other text.`;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      const text = response.text;
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from AI response');
      }

      const extractedData = JSON.parse(jsonMatch[0]);
      return extractedData;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to process your request. Please try again with more details.');
    }
  }

  /**
   * Generate a natural language summary of the booking
   * @param {Object} bookingDetails - Extracted booking details
   * @param {Object} worker - Matched worker details
   * @returns {Promise<string>} Human-readable summary
   */
  async generateBookingSummary(bookingDetails, worker) {
    try {
      const prompt = `Create a friendly, conversational booking summary for a customer.

Service Needed: ${bookingDetails.serviceType}
Problem: ${bookingDetails.problemDescription}
Urgency: ${bookingDetails.urgency}

Worker Matched:
- Name: ${worker.userId?.firstName} ${worker.userId?.lastName}
- Rating: ${worker.averageRating || 0}/5 (${worker.totalReviews || 0} reviews)
- Hourly Rate: ₹${worker.hourlyRate}
- Experience: ${worker.experience || 0} years
- Location: ${worker.location || 'Not specified'}

Write a 2-3 sentence confirmation message that:
1. Confirms what service they need
2. Introduces the matched worker briefly
3. Mentions why this worker is a good match (rating, experience, location)
4. Keeps a warm, helpful tone

Be concise and friendly. No bullet points or special formatting.`;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error('Summary Generation Error:', error);
      return `Great! I found ${worker.userId?.firstName}, a skilled ${bookingDetails.serviceType} with ${worker.averageRating || 0} stars rating. They charge ₹${worker.hourlyRate}/hour and can help you with your ${bookingDetails.problemDescription}.`;
    }
  }

  /**
   * Generate follow-up questions if the request is unclear
   * @param {Object} bookingDetails - Extracted booking details
   * @returns {Promise<Array<string>>} List of clarifying questions
   */
  async generateClarifyingQuestions(bookingDetails) {
    if (bookingDetails.confidence > 0.7) {
      return []; // No questions needed if confidence is high
    }

    try {
      const prompt = `The user requested a service but some details are unclear.

Extracted Information:
- Service Type: ${bookingDetails.serviceType}
- Problem: ${bookingDetails.problemDescription}
- Confidence: ${bookingDetails.confidence}

Generate 2-3 short, friendly questions (one per line) to clarify:
- Exact service needed if service type is "other"
- Specific problem details if description is vague
- Timing preferences if not mentioned
- Location if not provided

Keep questions casual and helpful. Start each question on a new line with a dash (-).`;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      const text = response.text;
      
      // Extract questions
      const questions = text
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(q => q.replace(/^-\s*/, '').trim())
        .filter(q => q.length > 0)
        .slice(0, 3);

      return questions;
    } catch (error) {
      console.error('Question Generation Error:', error);
      return ['Could you describe the problem in more detail?', 'When do you need this service?'];
    }
  }
}

const aiServiceInstance = new AIService();
module.exports = aiServiceInstance;
