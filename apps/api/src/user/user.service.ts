import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        const quizStats = await this.prisma.quizAttempt.aggregate({
            where: {
                userId,
                status: 'COMPLETED',
            },
            _count: {
                id: true,
            },
            _avg: {
                score: true,
            },
        });

        return {
            ...user,
            totalQuizzes: quizStats._count.id,
            averageScore: quizStats._avg.score || 0,
        };
    }
}
