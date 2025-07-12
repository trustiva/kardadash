const API_BASE_URL = 'http://localhost:8000'; // Your FastAPI backend URL

interface RequestOptions extends RequestInit {
  token?: string;
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const token = options.token || localStorage.getItem('kardash_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = {};
    }
    throw new Error(errorData.detail || 'An API error occurred');
  }
  // Handle 204 No Content responses
  if (response.status === 204) {
    return null as T; // Return null for no content
  }
  return response.json() as Promise<T>;
}

export default apiFetch; 