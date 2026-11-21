import { apiRequest } from './api'

export const listReservations = () => apiRequest('/reservations')
export const createReservation = (data) =>
  apiRequest('/reservations', { method: 'POST', body: JSON.stringify(data) })
export const cancelReservation = (id) =>
  apiRequest(`/reservations/${id}/cancel`, { method: 'PATCH' })