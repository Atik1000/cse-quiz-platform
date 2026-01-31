import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryInput, UpdateCategoryInput, CategoryTree } from '@cse-quiz/shared';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateCategoryInput) {
        if (data.parentId) {
            const parent = await this.prisma.category.findUnique({
                where: { id: data.parentId },
            });

            if (!parent) {
                throw new NotFoundException('Parent category not found');
            }
        }

        return this.prisma.category.create({
            data: {
                name: data.name,
                parentId: data.parentId || null,
            },
            include: {
                parent: true,
                children: true,
            },
        });
    }

    async findAll() {
        return this.prisma.category.findMany({
            include: {
                parent: true,
                children: true,
                _count: {
                    select: {
                        questions: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findTree(): Promise<CategoryTree[]> {
        const categories = await this.prisma.category.findMany({
            include: {
                children: {
                    include: {
                        children: true,
                    },
                },
            },
            where: {
                parentId: null,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return categories as CategoryTree[];
    }

    async findOne(id: string) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: true,
                _count: {
                    select: {
                        questions: true,
                    },
                },
            },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }

    async update(id: string, data: UpdateCategoryInput) {
        await this.findOne(id);

        if (data.parentId) {
            const parent = await this.prisma.category.findUnique({
                where: { id: data.parentId },
            });

            if (!parent) {
                throw new NotFoundException('Parent category not found');
            }

            // Prevent circular reference
            if (data.parentId === id) {
                throw new NotFoundException('Category cannot be its own parent');
            }
        }

        return this.prisma.category.update({
            where: { id },
            data,
            include: {
                parent: true,
                children: true,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.category.delete({
            where: { id },
        });
    }
}
