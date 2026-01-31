import Link from 'next/link';
import { BookOpen, Brain, Trophy, ArrowRight } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Brain className="w-8 h-8 text-primary-600" />
                        <span className="text-xl font-bold text-gray-900">CSE Quiz Platform</span>
                    </div>
                    <nav className="flex gap-4">
                        <Link
                            href="/login"
                            className="px-4 py-2 text-gray-700 hover:text-primary-600 transition"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                        >
                            Get Started
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Master Computer Science with
                        <span className="text-primary-600"> AI-Powered Quizzes</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Prepare for technical interviews and exams with dynamically generated questions
                        tailored to your learning needs
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center gap-2 text-lg font-semibold"
                        >
                            Start Learning
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/login"
                            className="px-8 py-4 bg-white border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition text-lg font-semibold"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
                        <BookOpen className="w-12 h-12 text-primary-600 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Comprehensive Topics
                        </h3>
                        <p className="text-gray-600">
                            Cover all major CSE subjects including Data Structures, Algorithms, Programming,
                            and Software Development
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
                        <Brain className="w-12 h-12 text-primary-600 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Generated Questions</h3>
                        <p className="text-gray-600">
                            Get unique, contextual questions powered by advanced AI, tailored to your
                            selected difficulty and topics
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
                        <Trophy className="w-12 h-12 text-primary-600 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Track Progress</h3>
                        <p className="text-gray-600">
                            Monitor your performance with detailed analytics and explanations for every
                            question
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Ace Your Next Interview?
                    </h2>
                    <p className="text-xl mb-8 text-primary-100">
                        Join thousands of students and professionals improving their CS knowledge
                    </p>
                    <Link
                        href="/register"
                        className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition text-lg font-semibold"
                    >
                        Create Free Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400">
                        © 2026 CSE Quiz Platform. Built with Next.js, NestJS, and OpenAI.
                    </p>
                </div>
            </footer>
        </div>
    );
}
