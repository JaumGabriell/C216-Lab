import { apiRequest } from './api'

export const listSpaces = () => apiRequest('/spaces')
export const createSpace = (data) =>
  apiRequest('/spaces', { method: 'POST', body: JSON.stringify(data) })
export const updateSpace = (id, data) =>
  apiRequest(`/spaces/${id}`, { method: 'PUT', body: JSON.stringify(data) })