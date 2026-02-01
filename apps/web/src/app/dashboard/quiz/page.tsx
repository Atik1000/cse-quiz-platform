'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { QuestionDifficulty } from '@cse-quiz/shared';
import { Play } from 'lucide-react';

export default function QuizPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        categoryId: '',
        difficulty: 'MIX' as QuestionDifficulty | 'MIX',
        numberOfQuestions: 10,
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await apiClient.get('/categories/tree');
            console.log('Loaded categories:', response.data);
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const handleStart = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('Sending quiz start request:', formData);
            const response = await apiClient.post('/quiz/start', formData);
            const attemptId = response.data.attemptId;

            // Store quiz data in localStorage for the quiz session
            localStorage.setItem(`quiz_${attemptId}`, JSON.stringify(response.data));

            // Navigate to the quiz page
            router.push(`/dashboard/quiz/${attemptId}`);
        } catch (error: any) {
            console.error('Failed to start quiz:', error);
            console.error('Error response:', error.response?.data);
            const errorMessage = error.response?.data?.message || 'Failed to start quiz. Please try again.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Start a Quiz</h1>
                <p className="text-gray-600 mt-2">Select your preferences and begin</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <form onSubmit={handleStart} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            required
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat: any) => (
                                <optgroup key={cat.id} label={cat.name}>
                                    <option value={cat.id}>{cat.name} (All)</option>
                                    {cat.children.map((sub: any) => (
                                        <option key={sub.id} value={sub.id}>
                                            {cat.name} → {sub.name}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Difficulty
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {['MIX', QuestionDifficulty.EASY, QuestionDifficulty.MEDIUM, QuestionDifficulty.HARD].map(
                                (diff) => (
                                    <button
                                        key={diff}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, difficulty: diff as any })}
                                        className={`px-4 py-3 rounded-lg font-medium transition ${formData.difficulty === diff
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {diff}
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Questions
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {[5, 10, 20, 30].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, numberOfQuestions: num })}
                                    className={`px-4 py-3 rounded-lg font-medium transition ${formData.numberOfQuestions === num
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Time limit: {formData.numberOfQuestions * 2} minutes
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Loading Quiz...
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5" />
                                Start Quiz
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
