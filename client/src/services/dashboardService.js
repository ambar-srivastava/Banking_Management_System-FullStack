import { apiRequest } from '@/services/apiClient';

export function getDashboard() {
    return apiRequest('/dashboard');
}