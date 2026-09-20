import { apiRequest } from './apiClient'

export function getAnalytics() {
    return apiRequest('/analytics')
}

export function getBalanceTrend(accountId) {
    return apiRequest(`/analytics/accounts/${accountId}/balance-trend`)
}