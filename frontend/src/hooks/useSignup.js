import { useState } from 'react';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (name, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.message || 'Signup failed');
        return { success: false }; // Return a success flag
      }

      return { success: true, data: json }; // Return a success flag and data
    } catch (err) {
      setError('An error occurred during signup');
      return { success: false }; // Return a success flag
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, error, isLoading };
};