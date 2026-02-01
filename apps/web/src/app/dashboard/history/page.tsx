'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { Trophy, Clock, Target } from 'lucide-react';

export default function HistoryPage() {
    const [history, setHistory] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const response = await apiClient.get('/quiz/history');
            setHistory(response.data);
        } catch (error) {
            console.error('Failed to load history:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Quiz History</h1>
                <p className="text-gray-600 mt-2">Review your past performance</p>
            </div>

            {/* Statistics */}
            {history?.statistics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Trophy className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {history.statistics.totalQuizzes}
                                </h3>
                                <p className="text-sm text-gray-600">Total Quizzes</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Target className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {history.statistics.averageScore.toFixed(1)}%
                                </h3>
                                <p className="text-sm text-gray-600">Average Score</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Clock className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {Math.floor(history.statistics.totalTimeSpent / 60)}m
                                </h3>
                                <p className="text-sm text-gray-600">Total Time</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Attempts List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Recent Attempts</h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {history?.attempts && history.attempts.length > 0 ? (
                        history.attempts.map((attempt: any) => (
                            <div key={attempt.id} className="p-6 hover:bg-gray-50 transition">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{attempt.quiz.title}</h3>
                                        <p className="text-sm text-gray-600">
                                            {attempt.quiz.category.name} • {attempt.totalQuestions} questions
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div
                                            className={`text-2xl font-bold ${attempt.score >= 80
                                                    ? 'text-green-600'
                                                    : attempt.score >= 60
                                                        ? 'text-blue-600'
                                                        : 'text-orange-600'
                                                }`}
                                        >
                                            {attempt.score.toFixed(1)}%
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {new Date(attempt.completedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p>No quiz attempts yet</p>
                            <Link
                                href="/dashboard/quiz"
                                className="inline-block mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                            >
                                Take Your First Quiz
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
