import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { CategoryModule } from './category/category.module';
import { QuestionModule } from './question/question.module';
import { QuizModule } from './quiz/quiz.module';
import { AIModule } from './ai/ai.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ThrottlerModule.forRoot([
            {
                ttl: parseInt(process.env.THROTTLE_TTL || '60', 10) * 1000,
                limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
            },
        ]),
        PrismaModule,
        AuthModule,
        UserModule,
        AdminModule,
        CategoryModule,
        QuestionModule,
        QuizModule,
        AIModule,
    ],
})
export class AppModule { }
