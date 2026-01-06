import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const SYSTEM_PROMPT = `You are a senior software debugging mentor creating practice quiz questions.
Generate multiple-choice questions (MCQs) based on the error analysis provided.
Each question should test understanding of the error, its causes, or the fix.

ALWAYS return a valid JSON array with this exact structure:
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0
  }
]

IMPORTANT:
- correctAnswer is the index (0-3) of the correct option
- Questions should be educational and test understanding
- Make questions progressively harder if multiple questions
- Use Hinglish (mix of Hindi and English) for questions
- Return ONLY valid JSON array, no markdown, no code blocks`;

export const generateQuizQuestions = async (analysis, numQuestions) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is missing');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `${SYSTEM_PROMPT}

Based on this error analysis, generate ${numQuestions} MCQ questions:

Error Explanation: ${analysis.error_explanation}
Root Cause: ${analysis.root_cause}
Fix: ${analysis.fix?.code || 'N/A'}
Why Fix Works: ${analysis.why_fix_works || 'N/A'}

Generate ${numQuestions} questions that test understanding of:
1. The error itself
2. Root cause identification
3. The fix and why it works
4. Related debugging concepts

Return the JSON array now:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '');
    }

    // Parse JSON
    const questions = JSON.parse(text);

    // Validate and ensure we have the right number
    if (!Array.isArray(questions)) {
      throw new Error('Invalid response format: expected array');
    }

    // Ensure each question has required fields
    const validatedQuestions = questions.slice(0, numQuestions).map((q, idx) => ({
      question: q.question || `Question ${idx + 1}`,
      options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
    }));

    return validatedQuestions;
  } catch (error) {
    console.error('Quiz generation error:', error);
    throw new Error('Failed to generate quiz questions. Please try again.');
  }
};

