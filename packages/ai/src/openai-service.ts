import OpenAI from 'openai';
import {
    GeneratedQuestion,
    QuestionType,
    generatedQuestionSchema,
} from '@cse-quiz/shared';
import { AIService, AIServiceConfig, QuestionGenerationParams } from './types';

export class OpenAIService implements AIService {
    private client: OpenAI;
    private model: string;
    private temperature: number;
    private maxTokens: number;

    constructor(config: AIServiceConfig) {
        this.client = new OpenAI({
            apiKey: config.apiKey,
        });
        this.model = config.model || 'gpt-4-turbo-preview';
        this.temperature = config.temperature || 0.7;
        this.maxTokens = config.maxTokens || 4000;
    }

    async generateQuestions(params: QuestionGenerationParams): Promise<GeneratedQuestion[]> {
        const prompt = this.buildPrompt(params);

        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: this.getSystemPrompt(),
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: this.temperature,
                max_tokens: this.maxTokens,
                response_format: { type: 'json_object' },
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new Error('No content received from OpenAI');
            }

            const parsed = JSON.parse(content);
            const questions = parsed.questions || [];

            // Validate each question
            const validatedQuestions: GeneratedQuestion[] = [];
            for (const q of questions) {
                try {
                    const validated = generatedQuestionSchema.parse(q);
                    validatedQuestions.push(validated);
                } catch (error) {
                    console.error('Invalid question format:', error);
                }
            }

            if (validatedQuestions.length === 0) {
                throw new Error('No valid questions generated');
            }

            return validatedQuestions;
        } catch (error) {
            console.error('Error generating questions:', error);
            throw new Error('Failed to generate questions from AI service');
        }
    }

    validateQuestions(questions: GeneratedQuestion[]): boolean {
        try {
            questions.forEach((q) => generatedQuestionSchema.parse(q));
            return true;
        } catch (error) {
            return false;
        }
    }

    private getSystemPrompt(): string {
        return `You are an expert Computer Science educator and technical interviewer specializing in creating high-quality, CSE-focused quiz questions for students and job seekers.

Your role is to generate technically accurate, well-structured questions that test both theoretical understanding and practical application.

STRICT OUTPUT FORMAT:
You MUST respond with a valid JSON object containing an array of questions. Each question must follow this exact schema:

{
  "questions": [
    {
      "question": "The actual question text",
      "options": ["Option A", "Option B", "Option C", "Option D"], // Only for MCQ
      "correctAnswer": "The correct answer",
      "explanation": "Detailed explanation of why this is correct and why others are wrong",
      "difficulty": "EASY" | "MEDIUM" | "HARD",
      "category": "Main category",
      "subcategory": "Specific subcategory"
    }
  ]
}

GUIDELINES:
1. For MCQ: Provide 4 options, make distractors plausible
2. For SHORT_ANSWER: Leave options empty, provide expected answer format in explanation
3. Difficulty levels:
   - EASY: Basic concepts, definitions, syntax
   - MEDIUM: Application, comparison, analysis
   - HARD: Complex scenarios, optimization, system design
4. Explanations must be educational and comprehensive
5. Questions must be relevant to CSE/Software Engineering interviews
6. Focus on practical, real-world scenarios when possible`;
    }

    private buildPrompt(params: QuestionGenerationParams): string {
        const { category, subcategory, difficulty, numberOfQuestions, type } = params;

        let difficultyInstruction = '';
        if (difficulty === 'MIX') {
            difficultyInstruction = `Generate a mix of difficulty levels: approximately ${Math.ceil(
                numberOfQuestions / 3
            )} EASY, ${Math.floor(numberOfQuestions / 3)} MEDIUM, and ${Math.floor(
                numberOfQuestions / 3
            )} HARD questions.`;
        } else {
            difficultyInstruction = `All questions should be ${difficulty} difficulty level.`;
        }

        let typeInstruction = '';
        switch (type) {
            case QuestionType.MCQ:
                typeInstruction = 'Generate Multiple Choice Questions (MCQ) with 4 options each.';
                break;
            case QuestionType.SHORT_ANSWER:
                typeInstruction =
                    'Generate Short Answer questions. Do not include options array. The correctAnswer should be a concise expected answer.';
                break;
            case QuestionType.CODING:
                typeInstruction =
                    'Generate Coding questions with problem descriptions. The correctAnswer should describe the expected solution approach.';
                break;
        }

        const categoryContext = subcategory
            ? `Main Category: ${category}, Subcategory: ${subcategory}`
            : `Category: ${category}`;

        return `Generate ${numberOfQuestions} Computer Science quiz questions with the following requirements:

${categoryContext}
${difficultyInstruction}
${typeInstruction}

CONTEXT:
- Target Audience: CSE students and professionals preparing for technical interviews
- Focus Area: ${category}${subcategory ? ' - ' + subcategory : ''}
- Question Type: ${type}

REQUIREMENTS:
1. Questions must be technically accurate and up-to-date
2. Focus on concepts commonly tested in technical interviews
3. Include practical scenarios where applicable
4. Explanations should teach, not just state the answer
5. For MCQ: Make distractors educational (common misconceptions)

OUTPUT:
Return ONLY a valid JSON object with the questions array. No additional text or markdown.`;
    }
}

// Factory function for creating AI service
export function createAIService(config: AIServiceConfig): AIService {
    return new OpenAIService(config);
}
