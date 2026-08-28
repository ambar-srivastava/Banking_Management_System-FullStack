import { apiRequest } from "./apiClient";

export function applyForLoanRequest(payload) {
    return apiRequest('/loans', { method: 'POST', body: JSON.stringify(payload) })
}

export function getMyLoansRequest() {
    return apiRequest('/loans/my')
}

export function getPendingLoansRequest() {
    return apiRequest('/loans/pending')
}

export function decideLoanRequest(loanId, decision) {
    return apiRequest(`/loans/${loanId}/decision`, {
        method: 'PATCH',
        body: JSON.stringify({ decision }),
    })
}