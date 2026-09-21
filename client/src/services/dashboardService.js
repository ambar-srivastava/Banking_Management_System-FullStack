import { apiRequest } from '@/lib/axiosClient';

export function getDashboard() {
    return apiRequest('/dashboard');
}