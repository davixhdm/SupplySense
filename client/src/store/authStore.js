import { create } from 'zustand';
export const useAuthStore = create((set) => ({
    isAuthenticated: !!localStorage.getItem('token'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token'),
    setAuth: (user, token) => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        set({ isAuthenticated: true, user, token });
    },
    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        set({ isAuthenticated: false, user: null, token: null });
    },
    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },
}));
