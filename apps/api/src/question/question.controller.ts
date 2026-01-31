import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import {
    CreateQuestionInput,
    UpdateQuestionInput,
    UserRole,
    createQuestionSchema,
    updateQuestionSchema,
    QuestionDifficulty,
} from '@cse-quiz/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('questions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuestionController {
    constructor(private questionService: QuestionService) { }

    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body(new ZodValidationPipe(createQuestionSchema)) data: CreateQuestionInput) {
        return this.questionService.create(data);
    }

    @Get()
    findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('categoryId') categoryId?: string,
        @Query('difficulty') difficulty?: QuestionDifficulty
    ) {
        return this.questionService.findAll(
            { page: page || 1, limit: limit || 10 },
            categoryId,
            difficulty
        );
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.questionService.findOne(id);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN)
    update(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(updateQuestionSchema)) data: UpdateQuestionInput
    ) {
        return this.questionService.update(id, data);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.questionService.remove(id);
    }
}
