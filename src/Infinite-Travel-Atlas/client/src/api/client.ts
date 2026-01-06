const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

interface ApiOptions extends RequestInit {
  parseJson?: boolean;
}

export async function apiFetch<TResponse>(
  path: string,
  options: ApiOptions = {}
): Promise<TResponse> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed (${response.status})`);
  }

  if (options.parseJson === false) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}
