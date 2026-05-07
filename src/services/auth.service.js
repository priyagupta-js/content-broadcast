import { MOCK_USERS } from '../utils/mockData';

const DEMO_PASSWORD = 'demo123';

/**
 * Auth Service
 * Swap the mock implementation with real API calls when backend is ready.
 * The interface (login / logout) stays the same.
 */
export const authService = {
  /**
   * Authenticate a user.
   * @param {string} email
   * @param {string} password
   * @returns {{ token: string, user: object }}
   */
  login: async (email, password) => {
    await new Promise(r => setTimeout(r, 800)); // simulate network latency

    const user = MOCK_USERS.find(u => u.email === email);
    if (!user || password !== DEMO_PASSWORD) {
      throw new Error('Invalid email or password. Try teacher@demo.com / demo123');
    }

    const token = btoa(`${user.id}:${Date.now()}`);
    return { token, user };
  },

  logout: async () => {
    await new Promise(r => setTimeout(r, 200));
    return true;
  },
};
