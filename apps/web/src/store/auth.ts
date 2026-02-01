import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../lib/api';
import { User, LoginInput, RegisterInput, AuthResponse } from '@cse-quiz/shared';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (data: LoginInput) => Promise<void>;
    register: (data: RegisterInput) => Promise<void>;
    logout: () => void;
    setAuth: (token: string, user: User) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (data: LoginInput) => {
                const response = await apiClient.post<AuthResponse>('/auth/login', data);
                const { accessToken, user } = response.data;

                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('user', JSON.stringify(user));

                set({
                    token: accessToken,
                    user,
                    isAuthenticated: true,
                });
            },

            register: async (data: RegisterInput) => {
                const response = await apiClient.post<AuthResponse>('/auth/register', data);
                const { accessToken, user } = response.data;

                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('user', JSON.stringify(user));

                set({
                    token: accessToken,
                    user,
                    isAuthenticated: true,
                });
            },

            logout: () => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                });
            },

            setAuth: (token: string, user: User) => {
                set({
                    token,
                    user,
                    isAuthenticated: true,
                });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
