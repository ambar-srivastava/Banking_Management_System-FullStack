import { apiRequest } from "./apiClient";

export function getMyAccounts() {
    return apiRequest('/accounts')
}

export function openAccountRequest(payload) {
    return apiRequest('/accounts', {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}

export function transferFundsRequest(payload) {
    return apiRequest('/accounts/transfer', {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}