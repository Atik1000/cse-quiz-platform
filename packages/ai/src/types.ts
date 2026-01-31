import { GeneratedQuestion, QuestionDifficulty, QuestionType } from '@cse-quiz/shared';

export interface AIServiceConfig {
    apiKey: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
}

export interface QuestionGenerationParams {
    category: string;
    subcategory?: string;
    difficulty: QuestionDifficulty | 'MIX';
    numberOfQuestions: number;
    type: QuestionType;
}

export interface AIService {
    generateQuestions(params: QuestionGenerationParams): Promise<GeneratedQuestion[]>;
    validateQuestions(questions: GeneratedQuestion[]): boolean;
}
