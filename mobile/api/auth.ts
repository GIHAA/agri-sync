import apiClient, { ApiResponse } from './apiClientAuth';

/**
 * Log in a user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<string>} - The authentication token.
 */
export const useLoginUser = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    const response: ApiResponse<{ token: string }> = await apiClient.post('/auth/login', {
      email,
      password,
    });

    return response.data.token;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
