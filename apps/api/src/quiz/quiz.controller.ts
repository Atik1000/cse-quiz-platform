import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { StartQuizInput, SubmitQuizInput, startQuizSchema, submitQuizSchema } from '@cse-quiz/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('quiz')
@UseGuards(JwtAuthGuard)
export class QuizController {
    constructor(private quizService: QuizService) { }

    @Post('start')
    startQuiz(
        @CurrentUser() user: any,
        @Body(new ZodValidationPipe(startQuizSchema)) data: StartQuizInput
    ) {
        return this.quizService.startQuiz(user.id, data);
    }

    @Post('submit')
    submitQuiz(
        @CurrentUser() user: any,
        @Body(new ZodValidationPipe(submitQuizSchema)) data: SubmitQuizInput
    ) {
        return this.quizService.submitQuiz(user.id, data);
    }

    @Get('history')
    getHistory(
        @CurrentUser() user: any,
        @Query('page') page?: number,
        @Query('limit') limit?: number
    ) {
        return this.quizService.getUserHistory(user.id, page || 1, limit || 10);
    }
}
