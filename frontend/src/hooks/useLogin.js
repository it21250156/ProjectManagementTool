import { useState } from 'react';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.message || 'Login failed');
        return { success: false }; // Return a success flag
      }

      // Store the token in localStorage
      if (json.token) {
        localStorage.setItem('token', json.token);
      }

      return { success: true, data: json }; // Return a success flag and data
    } catch (err) {
      setError('An error occurred during login');
      return { success: false }; // Return a success flag
    } finally {
      setIsLoading(false);
    }
  };

  return { login, error, isLoading };
};