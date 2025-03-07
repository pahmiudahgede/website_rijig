import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  role: string | null;
  token: string | null;
  login: (userId: string, role: string, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  role: null,
  token: null,

  // Action to log in the user
  login: (userId, role, token) => {
    // Save to localStorage if available
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);
    }

    set({ isAuthenticated: true, userId, role, token });
  },

  // Action to log out the user
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
    }

    set({ isAuthenticated: false, userId: null, role: null, token: null });
  },
}));

// Initialize state if localStorage values exist
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  if (token && userId && role) {
    useAuthStore.setState({ isAuthenticated: true, userId, role, token });
  }
}
