import { apiRequest } from "./apiClient";

export function getAllUsers() {
    return apiRequest('/admin/users')
}

export function createStaffUser(payload) {
    return apiRequest('/admin/users', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateUserRole(userId, role) {
    return apiRequest(`/admin/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) })
}