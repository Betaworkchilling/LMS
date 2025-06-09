const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const getAccessToken = () => localStorage.getItem('access');
export const getRefreshToken = () => localStorage.getItem('refresh');

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = getAccessToken();
  if (!token) throw new Error('No access token found');

  try {
    const response = await fetch(BASE_URL + url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const refreshResponse = await fetch(BASE_URL + '/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh token');
      }

      const { access } = await refreshResponse.json();
      localStorage.setItem('access', access);

      // Retry the original request with new token
      return fetchWithAuth(url, options);
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  const response = await fetch(BASE_URL + '/api/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: email, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Login failed: ${response.status} - ${error}`);
  }

  const data = await response.json();
  localStorage.setItem('access', data.access);
  localStorage.setItem('refresh', data.refresh);
  return data;
};

export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};
