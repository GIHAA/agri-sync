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
): Promise<any> => {
  try {
    const response: ApiResponse<any> = await apiClient.post('/auth-service/login', {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
