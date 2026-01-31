import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuestionService } from '../question/question.service';
import {
    StartQuizInput,
    SubmitQuizInput,
    QuizStatus,
    QuestionDifficulty,
    StartQuizResponse,
    QuizResult,
} from '@cse-quiz/shared';

@Injectable()
export class QuizService {
    constructor(
        private prisma: PrismaService,
        private questionService: QuestionService
    ) { }

    async startQuiz(userId: string, data: StartQuizInput): Promise<StartQuizResponse> {
        const category = await this.prisma.category.findUnique({
            where: { id: data.categoryId },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        // Get questions based on criteria
        const questions = await this.questionService.findByCategoryAndDifficulty(
            data.categoryId,
            data.difficulty,
            data.numberOfQuestions
        );

        if (questions.length < data.numberOfQuestions) {
            throw new BadRequestException(
                `Not enough questions available. Found ${questions.length}, requested ${data.numberOfQuestions}`
            );
        }

        // Shuffle and take requested number
        const shuffled = questions.sort(() => Math.random() - 0.5);
        const selectedQuestions = shuffled.slice(0, data.numberOfQuestions);

        // Create quiz
        const quiz = await this.prisma.quiz.create({
            data: {
                title: `${category.name} - ${data.difficulty} Quiz`,
                categoryId: data.categoryId,
                difficulty: data.difficulty,
                totalQuestions: data.numberOfQuestions,
                timeLimit: data.numberOfQuestions * 2, // 2 minutes per question
            },
        });

        // Link questions to quiz
        await Promise.all(
            selectedQuestions.map((q, index) =>
                this.prisma.quizQuestion.create({
                    data: {
                        quizId: quiz.id,
                        questionId: q.id,
                        order: index + 1,
                    },
                })
            )
        );

        // Create attempt
        const attempt = await this.prisma.quizAttempt.create({
            data: {
                userId,
                quizId: quiz.id,
                totalQuestions: data.numberOfQuestions,
                status: QuizStatus.IN_PROGRESS,
                answers: [],
            },
        });

        // Return quiz without answers
        return {
            attemptId: attempt.id,
            quiz,
            questions: selectedQuestions.map((q) => ({
                id: q.id,
                question: q.question,
                options: q.options,
                difficulty: q.difficulty,
                type: q.type,
                categoryId: q.categoryId,
                createdAt: q.createdAt,
                updatedAt: q.updatedAt,
            })),
            startedAt: attempt.startedAt,
        };
    }

    async submitQuiz(userId: string, data: SubmitQuizInput): Promise<QuizResult> {
        const attempt = await this.prisma.quizAttempt.findUnique({
            where: { id: data.attemptId },
            include: {
                quiz: {
                    include: {
                        quizQuestions: {
                            include: {
                                question: true,
                            },
                            orderBy: {
                                order: 'asc',
                            },
                        },
                    },
                },
            },
        });

        if (!attempt) {
            throw new NotFoundException('Quiz attempt not found');
        }

        if (attempt.userId !== userId) {
            throw new BadRequestException('This attempt does not belong to you');
        }

        if (attempt.status === QuizStatus.COMPLETED) {
            throw new BadRequestException('This quiz has already been submitted');
        }

        // Calculate score
        const questions = attempt.quiz.quizQuestions.map((qq) => qq.question);
        let correctAnswers = 0;

        const processedAnswers = data.answers.map((answer) => {
            const question = questions.find((q) => q.id === answer.questionId);
            if (!question) {
                return {
                    questionId: answer.questionId,
                    userAnswer: answer.answer,
                    isCorrect: false,
                    timeSpent: answer.timeSpent,
                };
            }

            const isCorrect =
                answer.answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();

            if (isCorrect) correctAnswers++;

            return {
                questionId: answer.questionId,
                userAnswer: answer.answer,
                isCorrect,
                timeSpent: answer.timeSpent,
            };
        });

        const score = (correctAnswers / questions.length) * 100;

        // Update attempt
        const updatedAttempt = await this.prisma.quizAttempt.update({
            where: { id: data.attemptId },
            data: {
                score,
                answers: processedAnswers,
                status: QuizStatus.COMPLETED,
                completedAt: new Date(),
            },
        });

        // Calculate time taken
        const timeTaken = Math.floor(
            (updatedAttempt.completedAt!.getTime() - updatedAttempt.startedAt.getTime()) / 1000
        );

        // Build result
        const questionsWithResults = questions.map((q) => {
            const userAnswer = processedAnswers.find((a) => a.questionId === q.id);
            return {
                ...q,
                userAnswer: userAnswer?.userAnswer || '',
                isCorrect: userAnswer?.isCorrect || false,
                timeSpent: userAnswer?.timeSpent || 0,
            };
        });

        return {
            attempt: updatedAttempt,
            questions: questionsWithResults,
            totalScore: score,
            percentage: score,
            timeTaken,
        };
    }

    async getUserHistory(userId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [attempts, total] = await Promise.all([
            this.prisma.quizAttempt.findMany({
                where: {
                    userId,
                    status: QuizStatus.COMPLETED,
                },
                include: {
                    quiz: {
                        include: {
                            category: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: {
                    completedAt: 'desc',
                },
            }),
            this.prisma.quizAttempt.count({
                where: {
                    userId,
                    status: QuizStatus.COMPLETED,
                },
            }),
        ]);

        // Calculate statistics
        const totalQuizzes = total;
        const averageScore =
            attempts.reduce((sum, a) => sum + a.score, 0) / (attempts.length || 1);

        const totalTimeSpent = attempts.reduce((sum, a) => {
            if (!a.completedAt) return sum;
            return sum + Math.floor((a.completedAt.getTime() - a.startedAt.getTime()) / 1000);
        }, 0);

        // Category breakdown
        const categoryMap = new Map();
        attempts.forEach((a) => {
            const catId = a.quiz.categoryId;
            const catName = a.quiz.category.name;
            if (!categoryMap.has(catId)) {
                categoryMap.set(catId, {
                    categoryId: catId,
                    categoryName: catName,
                    attempts: 0,
                    totalScore: 0,
                });
            }
            const cat = categoryMap.get(catId);
            cat.attempts++;
            cat.totalScore += a.score;
        });

        const categoryBreakdown = Array.from(categoryMap.values()).map((c) => ({
            ...c,
            averageScore: c.totalScore / c.attempts,
        }));

        return {
            attempts,
            statistics: {
                totalQuizzes,
                averageScore,
                totalTimeSpent,
                categoryBreakdown,
            },
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
