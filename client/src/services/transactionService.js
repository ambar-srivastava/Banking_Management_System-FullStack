import { apiRequest } from "./apiClient";

export function getTransactionHistory(accountId, filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      params.append(key, value);
    }
  });

  const query = params.toString();
  return apiRequest(
    `/accounts/${accountId}/transactions${query ? `?${query}` : ""}`,
  );
}
