import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    CreateQuestionInput,
    UpdateQuestionInput,
    QuestionDifficulty,
    PaginationInput,
} from '@cse-quiz/shared';

@Injectable()
export class QuestionService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateQuestionInput) {
        const category = await this.prisma.category.findUnique({
            where: { id: data.categoryId },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return this.prisma.question.create({
            data: {
                question: data.question,
                options: data.options || [],
                correctAnswer: data.correctAnswer,
                explanation: data.explanation,
                difficulty: data.difficulty,
                type: data.type,
                categoryId: data.categoryId,
            },
            include: {
                category: true,
            },
        });
    }

    async findAll(pagination?: PaginationInput, categoryId?: string, difficulty?: QuestionDifficulty) {
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 10;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (categoryId) where.categoryId = categoryId;
        if (difficulty) where.difficulty = difficulty;

        const [questions, total] = await Promise.all([
            this.prisma.question.findMany({
                where,
                include: {
                    category: true,
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.question.count({ where }),
        ]);

        return {
            data: questions,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const question = await this.prisma.question.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });

        if (!question) {
            throw new NotFoundException('Question not found');
        }

        return question;
    }

    async update(id: string, data: UpdateQuestionInput) {
        await this.findOne(id);

        if (data.categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: data.categoryId },
            });

            if (!category) {
                throw new NotFoundException('Category not found');
            }
        }

        return this.prisma.question.update({
            where: { id },
            data,
            include: {
                category: true,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.question.delete({
            where: { id },
        });
    }

    async findByCategoryAndDifficulty(
        categoryId: string,
        difficulty: QuestionDifficulty | 'MIX',
        limit: number
    ) {
        // Get the category and its subcategories
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                children: true,
            },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        // Include the selected category and all its children
        const categoryIds = [categoryId, ...category.children.map(c => c.id)];

        const where: any = {
            categoryId: {
                in: categoryIds,
            },
        };

        if (difficulty !== 'MIX') {
            where.difficulty = difficulty;
        }

        return this.prisma.question.findMany({
            where,
            take: limit * 2, // Get more than needed to ensure we have enough after shuffling
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}
