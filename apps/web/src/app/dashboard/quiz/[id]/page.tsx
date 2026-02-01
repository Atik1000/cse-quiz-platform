'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Clock, CheckCircle } from 'lucide-react';

export default function QuizAttemptPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [quiz, setQuiz] = useState<any>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Since we're in the app router, we need to handle params differently
        const attemptId = params.id;
        if (!attemptId) return;

        loadQuiz(attemptId);
    }, [params.id]);

    const loadQuiz = async (attemptId: string) => {
        try {
            // Note: You'd need to store quiz data in localStorage when starting
            const quizData = localStorage.getItem(`quiz_${attemptId}`);
            if (quizData) {
                const parsed = JSON.parse(quizData);
                setQuiz(parsed);
                setTimeRemaining(parsed.quiz.timeLimit * 60); // Convert to seconds
            }
        } catch (error) {
            console.error('Failed to load quiz:', error);
            alert('Failed to load quiz');
            router.push('/dashboard/quiz');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining]);

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const handleSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);

        try {
            const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
                questionId,
                answer,
                timeSpent: 60, // Simplified - in production, track per question
            }));

            const response = await apiClient.post('/quiz/submit', {
                attemptId: params.id,
                answers: formattedAnswers,
            });

            // Store result in localStorage for the result page
            const resultData = {
                attemptId: params.id,
                score: response.data.score || 0,
                totalQuestions: quiz.questions.length,
                correctAnswers: response.data.correctAnswers || 0,
                incorrectAnswers: response.data.incorrectAnswers || 0,
                timeTaken: quiz.quiz.timeLimit * 60 - timeRemaining,
                questions: quiz.questions.map((q: any, index: number) => ({
                    id: q.id,
                    question: q.question,
                    options: q.options || [],
                    correctAnswer: q.correctAnswer,
                    userAnswer: answers[q.id] || '',
                    isCorrect: answers[q.id] === q.correctAnswer,
                    explanation: q.explanation || 'No explanation provided',
                    difficulty: q.difficulty,
                })),
            };

            localStorage.setItem(`result_${params.id}`, JSON.stringify(resultData));
            localStorage.removeItem(`quiz_${params.id}`);
            router.push(`/dashboard/quiz/result/${params.id}`);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to submit quiz');
            setSubmitting(false);
        }
    };

    if (loading || !quiz) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">{quiz.quiz.title}</h1>
                    <div className="flex items-center gap-2 text-lg font-semibold text-primary-600">
                        <Clock className="w-5 h-5" />
                        {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                    </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    Question {currentQuestion + 1} of {quiz.questions.length}
                </p>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="mb-6">
                    <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded">
                        {question.difficulty}
                    </span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-6">{question.question}</h2>

                {question.options && question.options.length > 0 && (
                    <div className="space-y-3">
                        {question.options.map((option: string, index: number) => (
                            <label
                                key={index}
                                className={`block p-4 border-2 rounded-lg cursor-pointer transition ${answers[question.id] === option
                                    ? 'border-primary-600 bg-primary-50'
                                    : 'border-gray-200 hover:border-primary-300'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name={question.id}
                                    value={option}
                                    checked={answers[question.id] === option}
                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    className="mr-3"
                                />
                                <span className="text-gray-900">{option}</span>
                            </label>
                        ))}
                    </div>
                )}

                {(!question.options || question.options.length === 0) && (
                    <textarea
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        rows={4}
                        placeholder="Type your answer here..."
                    />
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                {currentQuestion < quiz.questions.length - 1 ? (
                    <button
                        onClick={() => setCurrentQuestion(currentQuestion + 1)}
                        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Submit Quiz
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
