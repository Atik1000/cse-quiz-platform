'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { QuestionDifficulty, QuestionType } from '@cse-quiz/shared';

export default function GenerateQuestionsPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        categoryId: '',
        subcategoryId: '',
        difficulty: 'MIX' as QuestionDifficulty | 'MIX',
        numberOfQuestions: 10,
        type: QuestionType.MCQ,
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await apiClient.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const payload = {
                ...formData,
                subcategoryId: formData.subcategoryId || undefined,
            };
            const response = await apiClient.post('/admin/generate-questions', payload);
            setResult(response.data);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to generate questions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Generate Questions</h1>
                <p className="text-gray-600 mt-2">Use AI to create new quiz questions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                required
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subcategory (Optional)
                            </label>
                            <select
                                value={formData.subcategoryId}
                                onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                disabled={!formData.categoryId}
                            >
                                <option value="">None</option>
                                {categories
                                    .filter((cat: any) => cat.parentId === formData.categoryId)
                                    .map((cat: any) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Difficulty
                            </label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) =>
                                    setFormData({ ...formData, difficulty: e.target.value as any })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="MIX">Mixed</option>
                                <option value={QuestionDifficulty.EASY}>Easy</option>
                                <option value={QuestionDifficulty.MEDIUM}>Medium</option>
                                <option value={QuestionDifficulty.HARD}>Hard</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Question Type
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value={QuestionType.MCQ}>Multiple Choice (MCQ)</option>
                                <option value={QuestionType.SHORT_ANSWER}>Short Answer</option>
                                <option value={QuestionType.CODING}>Coding</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Questions
                            </label>
                            <input
                                type="number"
                                required
                                min={1}
                                max={50}
                                value={formData.numberOfQuestions}
                                onChange={(e) =>
                                    setFormData({ ...formData, numberOfQuestions: parseInt(e.target.value) })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                            <p className="text-sm text-gray-500 mt-1">Maximum: 50 questions</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Generate Questions
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Result */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Result</h2>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-red-800">Error</p>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-green-800">Success!</p>
                                    <p className="text-sm text-green-700">{result.message}</p>
                                </div>
                            </div>

                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {result.questions.map((q: any, index: number) => (
                                    <div
                                        key={q.id}
                                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900">Question {index + 1}</h3>
                                            <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                                                {q.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 line-clamp-2">{q.question}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!error && !result && !loading && (
                        <div className="text-center text-gray-500 py-12">
                            <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p>Fill out the form and generate questions</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
