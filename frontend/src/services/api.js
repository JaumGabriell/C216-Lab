const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function apiRequest(path, options = {}) {
  const session = JSON.parse(localStorage.getItem('roomly_session') || 'null')
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || 'Não foi possível concluir a operação')
  }
  if (response.status === 204) return null
  return response.json()
}

export { API_URL }
