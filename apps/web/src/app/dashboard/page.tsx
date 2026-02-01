'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { apiClient } from '@/lib/api';
import { UserRole } from '@cse-quiz/shared';
import Link from 'next/link';
import { BookOpen, Trophy, Target, TrendingUp, ArrowRight, Brain } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            if (user?.role === UserRole.ADMIN) {
                const response = await apiClient.get('/admin/dashboard');
                setStats(response.data);
            } else {
                const response = await apiClient.get('/user/profile');
                setStats(response.data);
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
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

    const isAdmin = user?.role === UserRole.ADMIN;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-gray-600 mt-2">
                    {isAdmin
                        ? 'Manage your quiz platform and monitor performance'
                        : 'Ready to test your knowledge today?'}
                </p>
            </div>

            {isAdmin ? (
                <>
                    {/* Admin Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <BookOpen className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {stats?.totalQuestions || 0}
                            </h3>
                            <p className="text-sm text-gray-600">Total Questions</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Trophy className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {stats?.totalQuizAttempts || 0}
                            </h3>
                            <p className="text-sm text-gray-600">Quiz Attempts</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Brain className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {stats?.totalCategories || 0}
                            </h3>
                            <p className="text-sm text-gray-600">Categories</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {stats?.averageScore?.toFixed(1) || 0}%
                            </h3>
                            <p className="text-sm text-gray-600">Average Score</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link
                            href="/dashboard/admin/categories"
                            className="block bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-xl hover:shadow-lg transition"
                        >
                            <h3 className="text-2xl font-bold mb-2">Manage Categories</h3>
                            <p className="text-blue-100 mb-4">
                                Create and organize question categories
                            </p>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                Go to Categories <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>

                        <Link
                            href="/dashboard/admin/generate"
                            className="block bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-xl hover:shadow-lg transition"
                        >
                            <h3 className="text-2xl font-bold mb-2">Generate Questions</h3>
                            <p className="text-purple-100 mb-4">
                                Use AI to create new quiz questions
                            </p>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                Start Generating <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    </div>
                </>
            ) : (
                <>
                    {/* User Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <BookOpen className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {stats?.totalQuizzes || 0}
                            </h3>
                            <p className="text-sm text-gray-600">Quizzes Taken</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Trophy className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {stats?.averageScore?.toFixed(1) || 0}%
                            </h3>
                            <p className="text-sm text-gray-600">Average Score</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Target className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {stats?.averageScore > 80 ? 'Excellent' : stats?.averageScore > 60 ? 'Good' : 'Keep Practicing'}
                            </h3>
                            <p className="text-sm text-gray-600">Performance</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link
                            href="/dashboard/quiz"
                            className="block bg-gradient-to-br from-primary-500 to-primary-600 text-white p-8 rounded-xl hover:shadow-lg transition"
                        >
                            <h3 className="text-2xl font-bold mb-2">Take a Quiz</h3>
                            <p className="text-primary-100 mb-4">
                                Start a new quiz and test your knowledge
                            </p>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                Start Quiz <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>

                        <Link
                            href="/dashboard/history"
                            className="block bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-xl hover:shadow-lg transition"
                        >
                            <h3 className="text-2xl font-bold mb-2">View History</h3>
                            <p className="text-green-100 mb-4">
                                Review your past quizzes and performance
                            </p>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                View History <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
