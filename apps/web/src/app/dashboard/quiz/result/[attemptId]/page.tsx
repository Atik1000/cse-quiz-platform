'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { CheckCircle, XCircle, Clock, Trophy, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface QuestionResult {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    userAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
}

interface QuizResultData {
    attempt: any;
    questions: QuestionResult[];
    totalScore: number;
    percentage: number;
    timeTaken: number;
}

export default function QuizResultPage({ params }: { params: { attemptId: string } }) {
    const router = useRouter();
    const [result, setResult] = useState<QuizResultData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadResult();
    }, []);

    const loadResult = async () => {
        try {
            // Try to get from localStorage first
            const cachedResult = localStorage.getItem(`result_${params.attemptId}`);
            if (cachedResult) {
                setResult(JSON.parse(cachedResult));
                setLoading(false);
            } else {
                // If not in cache, we need to fetch from history
                // For now, redirect to history page
                router.push('/dashboard/history');
            }
        } catch (error) {
            console.error('Failed to load result:', error);
            router.push('/dashboard/history');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!result) {
        return null;
    }

    const correctCount = result.questions.filter((q) => q.isCorrect).length;
    const totalQuestions = result.questions.length;

    return (
        <div className="max-w-4xl mx-auto pb-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/dashboard/history"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to History
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Quiz Results</h1>
            </div>

            {/* Score Card */}
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-8 mb-8 border border-primary-200">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
                        <Trophy className="w-10 h-10 text-primary-600" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                        {result.percentage.toFixed(1)}%
                    </h2>
                    <p className="text-lg text-gray-600">
                        Score: {correctCount} / {totalQuestions}
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg p-4 text-center">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">{correctCount}</div>
                        <div className="text-sm text-gray-600">Correct</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                        <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">
                            {totalQuestions - correctCount}
                        </div>
                        <div className="text-sm text-gray-600">Incorrect</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                        <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">
                            {Math.floor(result.timeTaken / 60)}m
                        </div>
                        <div className="text-sm text-gray-600">Time Taken</div>
                    </div>
                </div>
            </div>

            {/* Question Results */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Detailed Results</h3>

                {result.questions.map((question, index) => (
                    <div
                        key={question.id}
                        className={`bg-white rounded-xl shadow-sm border-2 p-6 ${question.isCorrect ? 'border-green-200' : 'border-red-200'
                            }`}
                    >
                        {/* Question Header */}
                        <div className="flex items-start gap-3 mb-4">
                            <div
                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${question.isCorrect ? 'bg-green-100' : 'bg-red-100'
                                    }`}
                            >
                                {question.isCorrect ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-semibold text-gray-500">
                                        Question {index + 1}
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-1 rounded ${question.isCorrect
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {question.isCorrect ? 'Correct' : 'Incorrect'}
                                    </span>
                                </div>
                                <p className="text-lg font-medium text-gray-900">
                                    {question.question}
                                </p>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-2 mb-4">
                            {question.options.map((option, optIndex) => {
                                const isUserAnswer = option === question.userAnswer;
                                const isCorrectAnswer = option === question.correctAnswer;

                                return (
                                    <div
                                        key={optIndex}
                                        className={`p-3 rounded-lg border-2 ${isCorrectAnswer
                                                ? 'border-green-500 bg-green-50'
                                                : isUserAnswer && !isCorrectAnswer
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-200 bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isCorrectAnswer && (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            )}
                                            {isUserAnswer && !isCorrectAnswer && (
                                                <XCircle className="w-5 h-5 text-red-600" />
                                            )}
                                            <span
                                                className={
                                                    isCorrectAnswer
                                                        ? 'font-semibold text-green-900'
                                                        : isUserAnswer
                                                            ? 'font-semibold text-red-900'
                                                            : 'text-gray-700'
                                                }
                                            >
                                                {option}
                                            </span>
                                            {isUserAnswer && (
                                                <span className="ml-auto text-sm text-gray-600">
                                                    Your answer
                                                </span>
                                            )}
                                            {isCorrectAnswer && (
                                                <span className="ml-auto text-sm text-green-600">
                                                    Correct answer
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Explanation */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Explanation:</p>
                            <p className="text-sm text-blue-800">{question.explanation}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4 justify-center">
                <Link
                    href="/dashboard/quiz"
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                    Take Another Quiz
                </Link>
                <Link
                    href="/dashboard/history"
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                    View History
                </Link>
            </div>
        </div>
    );
}
