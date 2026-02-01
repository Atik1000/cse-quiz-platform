'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import {
    LayoutDashboard,
    BookOpen,
    Trophy,
    User,
    LogOut,
    Settings,
    FolderTree,
    Sparkles,
} from 'lucide-react';
import { UserRole } from '@cse-quiz/shared';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated || !user) {
        return null;
    }

    const isAdmin = user.role === UserRole.ADMIN;

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, show: true },
        { name: 'Take Quiz', href: '/dashboard/quiz', icon: BookOpen, show: true },
        { name: 'My History', href: '/dashboard/history', icon: Trophy, show: true },
        { name: 'Categories', href: '/dashboard/admin/categories', icon: FolderTree, show: isAdmin },
        {
            name: 'Generate Questions',
            href: '/dashboard/admin/generate',
            icon: Sparkles,
            show: isAdmin,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900">CSE Quiz Platform</h1>
                    {isAdmin && (
                        <span className="inline-block mt-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded">
                            ADMIN
                        </span>
                    )}
                </div>

                <nav className="p-4 space-y-2">
                    {navigation
                        .filter((item) => item.show)
                        .map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                                            ? 'bg-primary-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <div className="mb-3 px-4 py-2 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">{children}</main>
        </div>
    );
}
