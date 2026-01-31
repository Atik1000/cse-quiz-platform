import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { AIService as IAIService, QuestionGenerationParams } from '@cse-quiz/ai';
import { GeneratedQuestion } from '@cse-quiz/shared';

@Injectable()
export class AIService {
    constructor(@Inject('AI_SERVICE') private aiService: IAIService) { }

    async generateQuestions(params: QuestionGenerationParams): Promise<GeneratedQuestion[]> {
        try {
            const questions = await this.aiService.generateQuestions(params);

            if (!questions || questions.length === 0) {
                throw new BadRequestException('Failed to generate questions');
            }

            return questions;
        } catch (error) {
            console.error('AI Service Error:', error);
            throw new BadRequestException('Failed to generate questions from AI');
        }
    }

    validateQuestions(questions: GeneratedQuestion[]): boolean {
        return this.aiService.validateQuestions(questions);
    }
}
