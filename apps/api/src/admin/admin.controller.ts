import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AdminService } from './admin.service';
import { GenerateQuestionsInput, UserRole, generateQuestionsSchema } from '@cse-quiz/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Post('generate-questions')
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
    generateQuestions(
        @Body(new ZodValidationPipe(generateQuestionsSchema)) data: GenerateQuestionsInput
    ) {
        return this.adminService.generateQuestions(data);
    }

    @Get('dashboard')
    getDashboard() {
        return this.adminService.getDashboardStats();
    }

    @Get('users')
    getUsers(@Query('page') page?: number, @Query('limit') limit?: number) {
        return this.adminService.getAllUsers(page || 1, limit || 20);
    }
}
