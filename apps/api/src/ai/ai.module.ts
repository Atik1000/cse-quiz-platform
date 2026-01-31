import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AIService } from './ai.service';
import { createAIService } from '@cse-quiz/ai';

@Module({
    providers: [
        {
            provide: 'AI_SERVICE',
            useFactory: (configService: ConfigService) => {
                return createAIService({
                    apiKey: configService.get('OPENAI_API_KEY') || '',
                    model: 'gpt-4-turbo-preview',
                    temperature: 0.7,
                    maxTokens: 4000,
                });
            },
            inject: [ConfigService],
        },
        AIService,
    ],
    exports: [AIService],
})
export class AIModule { }
