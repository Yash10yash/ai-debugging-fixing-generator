import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI - will be set when analyzeError is called
let genAI = null;

const initializeGenAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

const getLanguageInstructions = (language = 'hinglish') => {
  const languageMap = {
    hindi: `- Explain EVERYTHING in PURE HINDI (Devanagari script)
- Use Hindi words and phrases throughout
- Translate all technical terms to Hindi
- Write in clear, simple Hindi
- Use proper Hindi grammar and sentence structure`,
    
    english: `- Explain EVERYTHING in PURE ENGLISH
- Use clear, professional English
- Use standard technical terminology
- Write in proper English grammar
- Be precise and technical`,
    
    hinglish: `- Explain in HINGLISH (mix of Hindi and English)
- Use Hindi words naturally mixed with English
- Use English for technical terms, Hindi for explanations
- Write in a conversational Hinglish style
- Make it feel natural and relatable`,
    
    spanish: `- Explain EVERYTHING in SPANISH
- Use clear, professional Spanish
- Translate technical terms appropriately
- Write in proper Spanish grammar
- Be clear and educational`,
    
    french: `- Explain EVERYTHING in FRENCH
- Use clear, professional French
- Translate technical terms appropriately
- Write in proper French grammar
- Be clear and educational`,
    
    german: `- Explain EVERYTHING in GERMAN
- Use clear, professional German
- Translate technical terms appropriately
- Write in proper German grammar
- Be clear and educational`,
    
    chinese: `- Explain EVERYTHING in CHINESE (Simplified)
- Use clear, professional Chinese
- Translate technical terms appropriately
- Write in proper Chinese grammar
- Be clear and educational`,
    
    japanese: `- Explain EVERYTHING in JAPANESE
- Use clear, professional Japanese
- Translate technical terms appropriately
- Write in proper Japanese grammar
- Be clear and educational`
  };

  return languageMap[language] || languageMap.hinglish;
};

const getSystemPrompt = (experienceLevel = 'beginner', language = 'hinglish') => {
  const levelInstructions = {
    beginner: `You are a senior software debugging mentor teaching a BEGINNER student.
- Use simple words and avoid technical jargon completely
- Break down every concept step-by-step
- Use real-world analogies and examples
- Explain WHY things happen, not just WHAT happens
- Be extremely detailed and patient
- Assume the student knows very little about programming
- Use simple language like you're explaining to a 10-year-old`,
    
    intermediate: `You are a senior software debugging mentor teaching an INTERMEDIATE developer.
- Use some technical terms but explain them briefly
- Provide clear explanations with context
- Include best practices and common patterns
- Balance simplicity with technical accuracy
- Assume basic programming knowledge
- Focus on understanding the debugging process`,
    
    experienced: `You are a senior software debugging mentor teaching an EXPERIENCED developer.
- Explain errors concisely with technical precision
- Use proper technical terminology
- Focus on root cause analysis and advanced debugging techniques
- Provide efficient solutions and best practices
- Assume strong programming knowledge
- Be direct and to the point
- Include advanced concepts and optimizations`
  };

  const languageInstructions = getLanguageInstructions(language);

  return `You are a senior software debugging mentor.
${levelInstructions[experienceLevel] || levelInstructions.beginner}

LANGUAGE REQUIREMENTS:
${languageInstructions}

Teach debugging logic, not just fixes.
Be clear, practical, and educational.

ALWAYS return a valid JSON object with this exact structure:
{
  "error_explanation": "Simple Hinglish explanation of the error",
  "root_cause": "The main reason why this error occurred",
  "possible_causes": [
    { "cause": "Cause description", "probability": 50 },
    { "cause": "Another possible cause", "probability": 30 },
    { "cause": "Less likely cause", "probability": 20 }
  ],
  "fix": {
    "code": "The fixed code or solution",
    "steps": ["Step 1", "Step 2", "Step 3"]
  },
  "why_fix_works": "Explanation of why this fix resolves the issue",
  "visual_flow": "Step-by-step execution flow in simple text",
  "real_world_example": "A relatable real-world analogy or example",
  "learning_tip": "A helpful tip for the developer to remember",
  "difficulty": "easy | medium | hard",
  "skill_score_delta": 5
}

IMPORTANT:
- Probabilities in possible_causes must total 100
- skill_score_delta should be between -5 and +10
- difficulty must be one of: easy, medium, hard
- Return ONLY valid JSON, no markdown, no code blocks
- Use Hinglish (mix of Hindi and English) for explanations`;
};

export const analyzeError = async (errorInput, errorType, experienceLevel = 'beginner', language = 'hinglish') => {
  try {
    // Initialize Gemini AI
    const ai = initializeGenAI();
    
    // Use gemini-2.5-flash (fast and reliable) or fallback to gemini-2.5-pro
    // Note: Old model names like 'gemini-pro' no longer exist
    let model;
    try {
      model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
    } catch (e) {
      // Fallback to pro version
      model = ai.getGenerativeModel({ model: 'gemini-2.5-pro' });
    }

    const systemPrompt = getSystemPrompt(experienceLevel, language);
    const prompt = `${systemPrompt}

Analyze this ${errorType}:

${errorInput}

Return the JSON response now:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response - remove markdown code blocks if present
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '');
    }

    // Parse JSON
    const aiResponse = JSON.parse(text);

    // Validate and normalize probabilities
    if (aiResponse.possible_causes && Array.isArray(aiResponse.possible_causes)) {
      const totalProb = aiResponse.possible_causes.reduce(
        (sum, cause) => sum + (cause.probability || 0),
        0
      );
      if (totalProb !== 100 && totalProb > 0) {
        // Normalize probabilities to total 100
        aiResponse.possible_causes = aiResponse.possible_causes.map((cause) => ({
          ...cause,
          probability: Math.round((cause.probability / totalProb) * 100),
        }));
      }
    }

    // Ensure difficulty is valid
    if (!['easy', 'medium', 'hard'].includes(aiResponse.difficulty)) {
      aiResponse.difficulty = 'medium';
    }

    // Ensure skill_score_delta is within range
    if (aiResponse.skill_score_delta) {
      aiResponse.skill_score_delta = Math.max(-5, Math.min(10, aiResponse.skill_score_delta));
    } else {
      aiResponse.skill_score_delta = 5;
    }

    return aiResponse;
  } catch (error) {
    console.error('Gemini API Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      apiKeySet: !!process.env.GEMINI_API_KEY,
      apiKeyPrefix: process.env.GEMINI_API_KEY?.substring(0, 10),
    });
    
    // Provide more specific error messages
    if (error.message?.includes('404') || error.message?.includes('not found')) {
      throw new Error('Gemini API: Model not found. Your API key might be invalid or not have access to Gemini models. Please verify your API key at https://aistudio.google.com/app/apikey');
    } else if (error.message?.includes('API_KEY') || error.message?.includes('401') || error.message?.includes('403')) {
      throw new Error('Invalid or unauthorized Gemini API key. Please check your API key in the .env file.');
    } else if (error.message?.includes('JSON')) {
      throw new Error('AI response format error. Please try again.');
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      throw new Error('Gemini API quota exceeded. Please check your API usage limits.');
    } else {
      throw new Error(`Gemini API Error: ${error.message || 'Unknown error'}. Please check your API key and try again.`);
    }
  }
};

