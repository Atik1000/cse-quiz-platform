import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AIService } from '../ai/ai.service';
import { CategoryService } from '../category/category.service';
import { GenerateQuestionsInput, QuestionType } from '@cse-quiz/shared';

@Injectable()
export class AdminService {
    constructor(
        private prisma: PrismaService,
        private aiService: AIService,
        private categoryService: CategoryService
    ) { }

    async generateQuestions(data: GenerateQuestionsInput) {
        // Validate category
        const category = await this.categoryService.findOne(data.categoryId);

        let subcategory = null;
        if (data.subcategoryId) {
            subcategory = await this.categoryService.findOne(data.subcategoryId);
        }

        // Call AI service to generate questions
        const generatedQuestions = await this.aiService.generateQuestions({
            category: category.name,
            subcategory: subcategory?.name,
            difficulty: data.difficulty,
            numberOfQuestions: data.numberOfQuestions,
            type: data.type,
        });

        if (!generatedQuestions || generatedQuestions.length === 0) {
            throw new BadRequestException('Failed to generate questions');
        }

        // Save questions to database
        const savedQuestions = await Promise.all(
            generatedQuestions.map((q) =>
                this.prisma.question.create({
                    data: {
                        question: q.question,
                        options: q.options || [],
                        correctAnswer: q.correctAnswer,
                        explanation: q.explanation,
                        difficulty: q.difficulty,
                        type: data.type,
                        categoryId: data.subcategoryId || data.categoryId,
                    },
                    include: {
                        category: true,
                    },
                })
            )
        );

        return {
            message: `Successfully generated ${savedQuestions.length} questions`,
            questions: savedQuestions,
        };
    }

    async getDashboardStats() {
        const [totalUsers, totalCategories, totalQuestions, totalQuizAttempts, recentAttempts] =
            await Promise.all([
                this.prisma.user.count(),
                this.prisma.category.count(),
                this.prisma.question.count(),
                this.prisma.quizAttempt.count({ where: { status: 'COMPLETED' } }),
                this.prisma.quizAttempt.findMany({
                    where: { status: 'COMPLETED' },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                        quiz: {
                            include: {
                                category: true,
                            },
                        },
                    },
                    orderBy: {
                        completedAt: 'desc',
                    },
                    take: 10,
                }),
            ]);

        // Question distribution by difficulty
        const questionsByDifficulty = await this.prisma.question.groupBy({
            by: ['difficulty'],
            _count: {
                id: true,
            },
        });

        // Questions by category
        const questionsByCategory = await this.prisma.category.findMany({
            select: {
                id: true,
                name: true,
                _count: {
                    select: {
                        questions: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        // Average quiz scores
        const avgScoreResult = await this.prisma.quizAttempt.aggregate({
            where: { status: 'COMPLETED' },
            _avg: {
                score: true,
            },
        });

        return {
            totalUsers,
            totalCategories,
            totalQuestions,
            totalQuizAttempts,
            averageScore: avgScoreResult._avg.score || 0,
            questionsByDifficulty: questionsByDifficulty.map((q) => ({
                difficulty: q.difficulty,
                count: q._count.id,
            })),
            questionsByCategory: questionsByCategory.map((c) => ({
                categoryId: c.id,
                categoryName: c.name,
                count: c._count.questions,
            })),
            recentAttempts,
        };
    }

    async getAllUsers(page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    _count: {
                        select: {
                            quizAttempts: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.user.count(),
        ]);

        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
