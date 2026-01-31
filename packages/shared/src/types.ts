import { z } from 'zod';

// ============ ENUMS ============
export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export enum QuestionDifficulty {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
}

export enum QuestionType {
    MCQ = 'MCQ',
    SHORT_ANSWER = 'SHORT_ANSWER',
    CODING = 'CODING',
}

export enum QuizStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
}

// ============ USER TYPES ============
export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserProfile extends Omit<User, 'password'> {
    totalQuizzes: number;
    averageScore: number;
}

// ============ AUTH TYPES ============
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    accessToken: string;
    user: Omit<User, 'password'>;
}

export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
}

// ============ CATEGORY TYPES ============
export interface Category {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CategoryWithChildren extends Category {
    children: Category[];
}

export interface CategoryTree extends Category {
    children: CategoryTree[];
}

// ============ QUESTION TYPES ============
export interface Question {
    id: string;
    question: string;
    options: string[] | null;
    correctAnswer: string;
    explanation: string;
    difficulty: QuestionDifficulty;
    type: QuestionType;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface QuestionGeneration {
    categoryId: string;
    subcategoryId?: string;
    difficulty: QuestionDifficulty | 'MIX';
    numberOfQuestions: number;
    type: QuestionType;
}

export interface GeneratedQuestion {
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: QuestionDifficulty;
    category: string;
    subcategory: string;
}

// ============ QUIZ TYPES ============
export interface Quiz {
    id: string;
    title: string;
    categoryId: string;
    difficulty: QuestionDifficulty | 'MIX';
    totalQuestions: number;
    timeLimit: number; // in minutes
    createdAt: Date;
    updatedAt: Date;
}

export interface QuizAttempt {
    id: string;
    userId: string;
    quizId: string;
    score: number;
    totalQuestions: number;
    answers: QuizAnswer[];
    startedAt: Date;
    completedAt: Date | null;
    status: QuizStatus;
}

export interface QuizAnswer {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    timeSpent: number; // in seconds
}

export interface QuizResult {
    attempt: QuizAttempt;
    questions: QuestionWithResult[];
    totalScore: number;
    percentage: number;
    timeTaken: number;
}

export interface QuestionWithResult extends Question {
    userAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
}

// ============ QUIZ START/SUBMIT ============
export interface StartQuizRequest {
    categoryId: string;
    difficulty: QuestionDifficulty | 'MIX';
    numberOfQuestions: number;
}

export interface StartQuizResponse {
    attemptId: string;
    quiz: Quiz;
    questions: Omit<Question, 'correctAnswer' | 'explanation'>[];
    startedAt: Date;
}

export interface SubmitQuizRequest {
    attemptId: string;
    answers: {
        questionId: string;
        answer: string;
        timeSpent: number;
    }[];
}

// ============ USER HISTORY ============
export interface UserQuizHistory {
    attempts: QuizAttempt[];
    statistics: {
        totalQuizzes: number;
        averageScore: number;
        totalTimeSpent: number;
        categoryBreakdown: {
            categoryId: string;
            categoryName: string;
            attempts: number;
            averageScore: number;
        }[];
    };
}

// ============ PAGINATION ============
export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// ============ API RESPONSES ============
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface ApiError {
    statusCode: number;
    message: string;
    error: string;
}
