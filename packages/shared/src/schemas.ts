import { z } from 'zod';
import { QuestionDifficulty, QuestionType } from './types';

// ============ AUTH SCHEMAS ============
export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
});

// ============ CATEGORY SCHEMAS ============
export const createCategorySchema = z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters'),
    parentId: z.string().uuid().optional().nullable(),
});

export const updateCategorySchema = z.object({
    name: z.string().min(2).optional(),
    parentId: z.string().uuid().optional().nullable(),
});

// ============ QUESTION SCHEMAS ============
export const createQuestionSchema = z.object({
    question: z.string().min(10, 'Question must be at least 10 characters'),
    options: z.array(z.string()).min(2).optional(),
    correctAnswer: z.string().min(1, 'Correct answer is required'),
    explanation: z.string().min(10, 'Explanation must be at least 10 characters'),
    difficulty: z.nativeEnum(QuestionDifficulty),
    type: z.nativeEnum(QuestionType),
    categoryId: z.string().uuid(),
});

export const updateQuestionSchema = createQuestionSchema.partial();

export const generatedQuestionSchema = z.object({
    question: z.string().min(10),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string().min(1),
    explanation: z.string().min(10),
    difficulty: z.nativeEnum(QuestionDifficulty),
    category: z.string(),
    subcategory: z.string(),
});

export const generateQuestionsSchema = z.object({
    categoryId: z.string().uuid(),
    subcategoryId: z.string().uuid().optional(),
    difficulty: z.union([
        z.nativeEnum(QuestionDifficulty),
        z.literal('MIX'),
    ]),
    numberOfQuestions: z.number().min(1).max(50),
    type: z.nativeEnum(QuestionType),
});

// ============ QUIZ SCHEMAS ============
export const startQuizSchema = z.object({
    categoryId: z.string().uuid(),
    difficulty: z.union([
        z.nativeEnum(QuestionDifficulty),
        z.literal('MIX'),
    ]),
    numberOfQuestions: z.number().min(1).max(50),
});

export const submitQuizSchema = z.object({
    attemptId: z.string().uuid(),
    answers: z.array(
        z.object({
            questionId: z.string().uuid(),
            answer: z.string().min(1),
            timeSpent: z.number().min(0),
        })
    ),
});

// ============ PAGINATION SCHEMAS ============
export const paginationSchema = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============ QUERY SCHEMAS ============
export const quizHistoryQuerySchema = paginationSchema.extend({
    categoryId: z.string().uuid().optional(),
    difficulty: z.nativeEnum(QuestionDifficulty).optional(),
    status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
export type GenerateQuestionsInput = z.infer<typeof generateQuestionsSchema>;
export type StartQuizInput = z.infer<typeof startQuizSchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type QuizHistoryQuery = z.infer<typeof quizHistoryQuerySchema>;
